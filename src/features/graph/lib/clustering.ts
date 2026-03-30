import { GraphNode, GraphPayload } from "@/shared/types/graph";

const SUB_CLUSTER_THRESHOLD = 30;

/**
 * Expand a cluster: if it has few enough nodes, show all.
 * Otherwise show top-K by importance and re-cluster remaining into sub-clusters.
 * Never mutates source GraphPayload.
 */
export function expand(
  clusterId: string,
  payload: GraphPayload,
  maxNodes: number
): GraphNode[] {
  // Gather word nodes belonging to this cluster from all levels
  const allWords: GraphNode[] = [];
  for (const level of Object.values(payload.levels)) {
    for (const node of level.nodes) {
      if (node.type === "word" && node.cluster === clusterId) {
        allWords.push({ ...node });
      }
    }
  }

  // Deduplicate by id
  const seenIds = new Set<string>();
  const uniqueWords = allWords.filter((n) => {
    if (seenIds.has(n.id)) return false;
    seenIds.add(n.id);
    return true;
  });

  if (uniqueWords.length <= maxNodes) {
    return uniqueWords.map((n) => ({ ...n }));
  }

  // Show top-K by importance
  const sorted = [...uniqueWords].sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0));
  const topK = sorted.slice(0, maxNodes - SUB_CLUSTER_THRESHOLD);
  const rest = sorted.slice(maxNodes - SUB_CLUSTER_THRESHOLD);

  // Re-cluster remaining into a single "more…" sub-cluster
  if (rest.length > 0) {
    const parentClusterNode = findClusterNode(clusterId, payload);
    const cx = parentClusterNode?.x ?? 0;
    const cy = parentClusterNode?.y ?? 0;

    const subCluster: GraphNode = {
      id: `${clusterId}_more`,
      type: "cluster",
      label: `${rest.length} more…`,
      size: rest.length,
      cluster: clusterId,
      x: cx + 50,
      y: cy + 50,
    };
    return [...topK, subCluster];
  }

  return topK;
}

function findClusterNode(clusterId: string, payload: GraphPayload): GraphNode | undefined {
  for (const level of Object.values(payload.levels)) {
    const found = level.nodes.find((n) => n.id === clusterId && n.type === "cluster");
    if (found) return found;
  }
  return undefined;
}
