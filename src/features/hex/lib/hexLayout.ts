import type { GraphPayload } from "@/shared/types/graph";
import type { HexCoord, HexNode, RingNode, RingTier, OffMapStub } from "@/shared/types/hex";
import { hexToPixel, hexRing, HEX_SIZE } from "./hexMath";

const CENTER: HexCoord = { q: 0, r: 0 };

/** Count how many word-nodes belong to a cluster. */
export function countClusterMembers(clusterId: string, payload: GraphPayload): number {
  // Use level 2 (all nodes) if available, else level 0
  const sortedKeys = Object.keys(payload.levels).sort();
  const levelKey = sortedKeys[sortedKeys.length - 1] ?? "0";
  const level = payload.levels[levelKey];
  return level.nodes.filter((n) => n.type === "word" && n.cluster === clusterId).length;
}

/**
 * Place cluster nodes in a spiral honeycomb.
 * Largest cluster at center, then fill concentric hex rings outward.
 */
export function layoutOverview(payload: GraphPayload): HexNode[] {
  const sortedKeys = Object.keys(payload.levels).sort();
  const levelKey = sortedKeys[0] ?? "0";
  const level = payload.levels[levelKey];

  const clusters = level.nodes
    .filter((n) => n.type === "cluster")
    .map((n) => ({
      ...n,
      childCount: countClusterMembers(n.id, payload),
    }))
    .sort((a, b) => (b.size ?? b.childCount) - (a.size ?? a.childCount));

  const placed: HexNode[] = [];
  let clusterIdx = 0;
  let ring = 0;

  while (clusterIdx < clusters.length) {
    const ringCoords = hexRing(CENTER, ring);
    for (const hex of ringCoords) {
      if (clusterIdx >= clusters.length) break;
      const n = clusters[clusterIdx];
      const { px, py } = hexToPixel(hex, HEX_SIZE * 2.2);
      placed.push({
        id: n.id,
        label: n.label,
        type: n.type,
        importance: n.importance ?? 0.5,
        childCount: n.childCount,
        px,
        py,
        hex,
      });
      clusterIdx++;
    }
    ring++;
  }

  return placed;
}

/**
 * Lay out ring view: center node + neighbors in tiers.
 * Returns center HexNode, ring nodes by tier, and off-map stubs.
 */
export function layoutRing(
  centerId: string,
  payload: GraphPayload,
  maxNodes: number = 36
): {
  center: HexNode;
  rings: RingNode[];
  offMap: OffMapStub[];
} {
  // Use level 0 for cluster-to-cluster edges
  const level0 = payload.levels["0"] ?? payload.levels[Object.keys(payload.levels)[0]];
  const clusterNode = level0.nodes.find((n) => n.id === centerId);

  if (!clusterNode) {
    throw new Error(`Cluster ${centerId} not found`);
  }

  // Find all neighboring clusters and their edge weights
  const neighborWeights = new Map<string, number>();
  for (const edge of level0.edges) {
    const src = edge.source as string;
    const tgt = edge.target as string;
    if (src === centerId || tgt === centerId) {
      const neighborId = src === centerId ? tgt : src;
      const existing = neighborWeights.get(neighborId) ?? 0;
      neighborWeights.set(neighborId, Math.max(existing, edge.weight ?? 1));
    }
  }

  const allNeighbors = Array.from(neighborWeights.entries())
    .map(([id, weight]) => {
      const node = level0.nodes.find((n) => n.id === id);
      return { id, weight, node };
    })
    .filter((e) => e.node != null)
    .sort((a, b) => b.weight - a.weight);

  // Tier slot counts
  const INNER_SLOTS = 6;
  const MIDDLE_SLOTS = 12;
  const OUTER_SLOTS = 18;
  const totalSlots = INNER_SLOTS + MIDDLE_SLOTS + OUTER_SLOTS;
  const maxVisible = Math.min(maxNodes, totalSlots);

  const visible = allNeighbors.slice(0, maxVisible);
  const overflow = allNeighbors.slice(maxVisible);

  // Assign tiers by rank thresholds
  const innerCount = Math.min(visible.length, Math.ceil(visible.length * 0.25));
  const middleCount = Math.min(visible.length - innerCount, Math.ceil(visible.length * 0.30));

  const centerHex: HexCoord = { q: 0, r: 0 };
  const { px: cpx, py: cpy } = hexToPixel(centerHex, HEX_SIZE * 2.2);

  const center: HexNode = {
    id: clusterNode.id,
    label: clusterNode.label,
    type: clusterNode.type,
    importance: clusterNode.importance ?? 0.5,
    childCount: countClusterMembers(centerId, payload),
    px: cpx,
    py: cpy,
    hex: centerHex,
  };

  const rings: RingNode[] = [];

  const placeInRing = (
    items: typeof visible,
    ringRadius: number,
    tier: RingTier,
    slotCount: number
  ) => {
    const count = Math.min(items.length, slotCount);
    const ringCoords = hexRing(centerHex, ringRadius);
    for (let i = 0; i < count; i++) {
      const item = items[i];
      if (!item.node) continue;
      const hexIdx = Math.round((i / count) * ringCoords.length) % ringCoords.length;
      const hex = ringCoords[hexIdx];
      const { px, py } = hexToPixel(hex, HEX_SIZE * 2.2);
      const angle = Math.atan2(py - cpy, px - cpx);
      rings.push({
        id: item.id,
        label: item.node.label,
        type: item.node.type,
        importance: item.node.importance ?? 0.5,
        childCount: countClusterMembers(item.id, payload),
        px,
        py,
        hex,
        tier,
        strength: item.weight,
        angle,
      });
    }
  };

  placeInRing(visible.slice(0, innerCount), 1, "inner", INNER_SLOTS);
  placeInRing(visible.slice(innerCount, innerCount + middleCount), 2, "middle", MIDDLE_SLOTS);
  placeInRing(visible.slice(innerCount + middleCount), 3, "outer", OUTER_SLOTS);

  // Off-map stubs for overflow neighbors
  const offMap: OffMapStub[] = overflow.map((item, idx) => {
    const count = overflow.length;
    const angle = count > 1
      ? ((idx / count) * 2 * Math.PI) - Math.PI / 2
      : -Math.PI / 2;
    return {
      sourceId: centerId,
      targetCluster: item.id,
      targetLabel: item.node?.label ?? item.id,
      strength: item.weight,
      exitAngle: angle,
    };
  });

  return { center, rings, offMap };
}
