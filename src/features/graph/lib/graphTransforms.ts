import { GraphLevel, GraphNode, GraphEdge } from "@/shared/types/graph";

/**
 * Build a view from a level, capping at maxNodes.
 * Always includes all cluster nodes + top-K word nodes by importance.
 * Never mutates source data — always returns new objects.
 */
export function buildView(level: GraphLevel, maxNodes: number): GraphLevel {
  const clusters: GraphNode[] = level.nodes
    .filter((n) => n.type === "cluster")
    .map((n) => ({ ...n }));

  const words: GraphNode[] = level.nodes
    .filter((n) => n.type === "word")
    .map((n) => ({ ...n }));

  const budget = Math.max(0, maxNodes - clusters.length);
  const topWords = [...words]
    .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0))
    .slice(0, budget);

  const visibleNodes = [...clusters, ...topWords];
  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  const visibleEdges: GraphEdge[] = level.edges
    .filter((e) => visibleIds.has(e.source as string) && visibleIds.has(e.target as string))
    .map((e) => ({ ...e }));

  // Fix positions so force simulation doesn't move nodes
  for (const node of visibleNodes) {
    node.fx = node.x;
    node.fy = node.y;
  }

  return { nodes: visibleNodes, edges: visibleEdges };
}

/**
 * Extract only the cluster nodes from a level.
 */
export function getClusterNodes(level: GraphLevel): GraphNode[] {
  return level.nodes.filter((n) => n.type === "cluster").map((n) => ({ ...n }));
}
