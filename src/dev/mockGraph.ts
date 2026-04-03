import { GraphPayload, GraphNode, GraphEdge } from "@/shared/types/graph";

export interface MockGraphOptions {
  clusterCount?: number;
  nodesPerCluster?: number;
  edgeDensity?: number;
  /** Controls inter-cluster edge density separately; defaults to edgeDensity × 0.5. */
  interClusterDensity?: number;
  spread?: number;
  /** RNG seed for deterministic but varied topologies (default 42). */
  seed?: number;
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

export function generateMockGraph(options: MockGraphOptions = {}): GraphPayload {
  const {
    clusterCount = 8,
    nodesPerCluster = 50,
    edgeDensity = 0.3,
    interClusterDensity = edgeDensity * 0.5,
    spread = 500,
    seed = 42,
  } = options;

  const rand = rng(seed);

  // --- Generate cluster centroids ---
  const clusterNodes: GraphNode[] = Array.from({ length: clusterCount }, (_, i) => {
    const angle = (i / clusterCount) * 2 * Math.PI;
    const r = spread * 0.6 + rand() * spread * 0.3;
    return {
      id: `C${i + 1}`,
      type: "cluster",
      label: CLUSTER_LABELS[i % CLUSTER_LABELS.length],
      size: Math.round(nodesPerCluster * (0.5 + rand() * 1.5)),
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
    };
  });

  // --- Generate word nodes around centroids ---
  const wordNodes: GraphNode[] = [];
  for (const cluster of clusterNodes) {
    for (let j = 0; j < nodesPerCluster; j++) {
      const angle = rand() * 2 * Math.PI;
      const r = 20 + rand() * 80;
      wordNodes.push({
        id: `${cluster.id}_w${j + 1}`,
        type: "word",
        label: `${cluster.label.toLowerCase()}_${j + 1}`,
        importance: rand(),
        cluster: cluster.id,
        x: cluster.x + Math.cos(angle) * r,
        y: cluster.y + Math.sin(angle) * r,
      });
    }
  }

  // --- Generate edges ---
  function makeEdges(nodes: GraphNode[], density: number): GraphEdge[] {
    const edges: GraphEdge[] = [];
    const ids = nodes.map((n) => n.id);
    for (let a = 0; a < ids.length; a++) {
      for (let b = a + 1; b < ids.length; b++) {
        if (rand() < density) {
          edges.push({
            source: ids[a],
            target: ids[b],
            weight: Math.round(1 + rand() * 4),
          });
        }
      }
    }
    return edges;
  }

  // Intra-cluster edges (word nodes within same cluster)
  const intraEdges: GraphEdge[] = [];
  for (const cluster of clusterNodes) {
    const members = wordNodes.filter((n) => n.cluster === cluster.id);
    intraEdges.push(...makeEdges(members, edgeDensity));
  }

  // Inter-cluster edges (between cluster nodes)
  const interEdges = makeEdges(clusterNodes, interClusterDensity);

  // Assign similarity to inter-cluster edges based on centroid distance
  const clusterMap = new Map(clusterNodes.map((c) => [c.id, c]));
  let maxDist = 0;
  for (const edge of interEdges) {
    const a = clusterMap.get(edge.source as string)!;
    const b = clusterMap.get(edge.target as string)!;
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (dist > maxDist) maxDist = dist;
  }
  for (const edge of interEdges) {
    const a = clusterMap.get(edge.source as string)!;
    const b = clusterMap.get(edge.target as string)!;
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    // Closer clusters → higher similarity
    edge.similarity = maxDist > 0 ? 1 - dist / maxDist : 1;
  }

  // Assign similarity to intra-cluster edges (high, with jitter)
  for (const edge of intraEdges) {
    edge.similarity = 0.7 + rand() * 0.3; // 0.7–1.0
  }

  // Top-word edges connecting top words to their cluster
  const topWordEdges: GraphEdge[] = wordNodes
    .filter((n) => (n.importance ?? 0) > 0.7)
    .map((n) => ({ source: n.cluster!, target: n.id, weight: 1, similarity: 0.8 + rand() * 0.2 }));

  // --- Compute cluster-level metadata ---
  for (const cluster of clusterNodes) {
    const members = wordNodes.filter((n) => n.cluster === cluster.id);
    const memberIds = new Set(members.map((m) => m.id));
    const clusterIntraEdges = intraEdges.filter(
      (e) => memberIds.has(e.source as string) && memberIds.has(e.target as string)
    );
    const maxPossibleEdges = (members.length * (members.length - 1)) / 2;
    cluster.cohesion = maxPossibleEdges > 0 ? clusterIntraEdges.length / maxPossibleEdges : 0;

    const totalImportance = members.reduce((sum, m) => sum + (m.importance ?? 0), 0);
    cluster.avgImportance = members.length > 0 ? totalImportance / members.length : 0;
  }

  // --- Build levels ---
  // Level 0: clusters only
  const level0Edges = interEdges;
  // Level 1: clusters + top words (importance > 0.5)
  const topWords = wordNodes.filter((n) => (n.importance ?? 0) > 0.5);
  const level1Nodes = [...clusterNodes, ...topWords];
  const level1NodeIds = new Set(level1Nodes.map((n) => n.id));
  const level1Edges = [
    ...interEdges,
    ...topWordEdges.filter((e) => level1NodeIds.has(e.target)),
    ...intraEdges.filter(
      (e) => level1NodeIds.has(e.source) && level1NodeIds.has(e.target)
    ),
  ];
  // Level 2: all nodes
  const allNodes = [...clusterNodes, ...wordNodes];
  const allEdges = [...interEdges, ...topWordEdges, ...intraEdges];

  return {
    meta: { version: 1, levels: 3 },
    levels: {
      "0": { nodes: clusterNodes, edges: level0Edges },
      "1": { nodes: level1Nodes, edges: level1Edges },
      "2": { nodes: allNodes, edges: allEdges },
    },
  };
}

const CLUSTER_LABELS = [
  "Food",
  "Technology",
  "Science",
  "Sports",
  "Politics",
  "Music",
  "Art",
  "Finance",
  "Health",
  "Travel",
  "Education",
  "Nature",
];
