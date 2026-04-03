export type GraphNodeType = "cluster" | "word";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  size?: number;
  importance?: number;
  cluster?: string;
  x: number;
  y: number;
  fx?: number;
  fy?: number;
  /** Cluster-only: average intra-cluster edge density (0–1). */
  cohesion?: number;
  /** Cluster-only: mean importance of member word nodes. */
  avgImportance?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  /** Semantic similarity between endpoints, 0 (unrelated) to 1 (identical). */
  similarity?: number;
}

export interface GraphLevel {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphPayload {
  meta: { version: number; levels: number };
  levels: Record<string, GraphLevel>;
}
