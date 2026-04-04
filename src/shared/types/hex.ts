export interface HexCoord {
  q: number;
  r: number;
}

export interface HexNode {
  id: string;
  label: string;
  type: string;
  importance: number;
  childCount?: number;
  /** Stable index used by distinctColor() for per-node coloring. */
  colorIndex: number;
  px: number;
  py: number;
  hex: HexCoord;
}

export type RingTier = "inner" | "middle" | "outer";

export interface RingNode extends HexNode {
  tier: RingTier;
  strength: number;
  angle: number;
}

export interface RoutedSegment {
  from: { px: number; py: number };
  to: { px: number; py: number };
}

export interface RoutedEdge {
  id: string;
  sourceId: string;
  targetId: string;
  weight: number;
  color: string;
  segments: RoutedSegment[];
}

export interface OffMapStub {
  sourceId: string;
  targetCluster: string;
  targetLabel: string;
  strength: number;
  exitAngle: number;
}

export type ViewMode = "overview" | "cluster-ring" | "node-ring";
