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
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface GraphLevel {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphPayload {
  meta: { version: number; levels: number };
  levels: Record<string, GraphLevel>;
}
