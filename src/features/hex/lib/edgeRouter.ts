import type { HexNode, RoutedEdge, RoutedSegment } from "@/shared/types/hex";
import type { GraphEdge } from "@/shared/types/graph";
import { hexNeighbors, hexToPixel, hexDistance, hexKey, HEX_SIZE } from "./hexMath";
import type { HexCoord } from "@/shared/types/hex";
import { EDGE_COLOR } from "@/shared/lib/colors";

/** A* search through hex grid, avoiding occupied cells except start/end. */
function astar(
  start: HexCoord,
  goal: HexCoord,
  occupied: Set<string>
): HexCoord[] | null {
  const startKey = hexKey(start);
  const goalKey = hexKey(goal);

  if (startKey === goalKey) return [start];

  interface AStarNode {
    hex: HexCoord;
    g: number;
    f: number;
    parent: AStarNode | null;
  }

  const open = new Map<string, AStarNode>();
  const closed = new Set<string>();

  const startNode: AStarNode = { hex: start, g: 0, f: hexDistance(start, goal), parent: null };
  open.set(startKey, startNode);

  let iterations = 0;
  const MAX_ITER = 500;

  while (open.size > 0 && iterations < MAX_ITER) {
    iterations++;

    // Find node with lowest f
    let current: AStarNode | null = null;
    for (const node of open.values()) {
      if (current === null || node.f < current.f) current = node;
    }
    if (!current) break;

    const currentKey = hexKey(current.hex);
    if (currentKey === goalKey) {
      // Reconstruct path
      const path: HexCoord[] = [];
      let n: AStarNode | null = current;
      while (n) {
        path.unshift(n.hex);
        n = n.parent;
      }
      return path;
    }

    open.delete(currentKey);
    closed.add(currentKey);

    for (const neighbor of hexNeighbors(current.hex)) {
      const nKey = hexKey(neighbor);
      if (closed.has(nKey)) continue;

      const isOccupied = occupied.has(nKey);
      const isStartOrGoal = nKey === startKey || nKey === goalKey;
      if (isOccupied && !isStartOrGoal) continue;

      const g = current.g + 1;
      const existing = open.get(nKey);
      if (!existing || g < existing.g) {
        const node: AStarNode = {
          hex: neighbor,
          g,
          f: g + hexDistance(neighbor, goal),
          parent: current,
        };
        open.set(nKey, node);
      }
    }
  }

  return null;
}

/**
 * Route edges through the hex grid using A*.
 * Contact pairs (adjacent hexes) don't need drawn edges.
 */
export function routeEdges(
  nodes: HexNode[],
  edges: GraphEdge[],
  contactPairs: Set<string>
): RoutedEdge[] {
  const nodeMap = new Map<string, HexNode>(nodes.map((n) => [n.id, n]));
  const occupied = new Set<string>(nodes.map((n) => hexKey(n.hex)));

  const routed: RoutedEdge[] = [];

  for (const edge of edges) {
    const srcId = edge.source as string;
    const tgtId = edge.target as string;
    const pairKey = `${srcId}:${tgtId}`;
    const pairKeyRev = `${tgtId}:${srcId}`;

    if (contactPairs.has(pairKey) || contactPairs.has(pairKeyRev)) continue;

    const src = nodeMap.get(srcId);
    const tgt = nodeMap.get(tgtId);
    if (!src || !tgt) continue;

    const path = astar(src.hex, tgt.hex, occupied);

    let segments: RoutedSegment[];
    if (path && path.length > 1) {
      segments = [];
      for (let i = 0; i < path.length - 1; i++) {
        const fromPx = hexToPixel(path[i], HEX_SIZE * 2.2);
        const toPx = hexToPixel(path[i + 1], HEX_SIZE * 2.2);
        segments.push({ from: fromPx, to: toPx });
      }
    } else {
      // Fallback: direct line
      segments = [{ from: { px: src.px, py: src.py }, to: { px: tgt.px, py: tgt.py } }];
    }

    routed.push({
      id: `${srcId}--${tgtId}`,
      sourceId: srcId,
      targetId: tgtId,
      weight: edge.weight ?? 1,
      color: EDGE_COLOR,
      segments,
    });
  }

  return routed;
}

/** Compute which node pairs are hex-adjacent (contact pairs). */
export function computeContactPairs(nodes: HexNode[]): Set<string> {
  const hexToNode = new Map<string, string>(nodes.map((n) => [hexKey(n.hex), n.id]));
  const pairs = new Set<string>();

  for (const node of nodes) {
    for (const neighbor of hexNeighbors(node.hex)) {
      const neighborId = hexToNode.get(hexKey(neighbor));
      if (neighborId && neighborId !== node.id) {
        pairs.add(`${node.id}:${neighborId}`);
      }
    }
  }

  return pairs;
}
