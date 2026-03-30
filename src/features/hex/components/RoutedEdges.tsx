import { memo } from "react";
import type { RoutedEdge } from "@/shared/types/hex";

interface Props {
  edges: RoutedEdge[];
  hoveredId: string | null;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export const RoutedEdges = memo(function RoutedEdges({
  edges,
  hoveredId,
  width,
  height,
  offsetX,
  offsetY,
}: Props) {
  const hasHover = hoveredId !== null;

  return (
    <svg
      className="routed-edges"
      width={width}
      height={height}
      style={{ left: 0, top: 0 }}
      aria-hidden="true"
    >
      {edges.map((edge) => {
        const isConnected =
          edge.sourceId === hoveredId || edge.targetId === hoveredId;
        const opacity = hasHover ? (isConnected ? 1 : 0.08) : 0.4;

        return edge.segments.map((seg, i) => (
          <line
            key={`${edge.id}-${i}`}
            x1={seg.from.px + offsetX}
            y1={seg.from.py + offsetY}
            x2={seg.to.px + offsetX}
            y2={seg.to.py + offsetY}
            stroke={edge.color}
            strokeWidth={Math.max(1, edge.weight * 0.8)}
            opacity={opacity}
            strokeLinecap="round"
          />
        ));
      })}
    </svg>
  );
});
