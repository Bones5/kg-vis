import { memo } from "react";
import type { HexNode } from "@/shared/types/hex";

interface Props {
  nodes: HexNode[];
  activeClusterId: string | null;
  onNavigate: (clusterId: string) => void;
}

const DOT_RADIUS = 5;
const MAP_SIZE = 120;
const PADDING = 10;

export const Minimap = memo(function Minimap({ nodes, activeClusterId, onNavigate }: Props) {
  if (nodes.length === 0) return null;

  const minX = Math.min(...nodes.map((n) => n.px));
  const maxX = Math.max(...nodes.map((n) => n.px));
  const minY = Math.min(...nodes.map((n) => n.py));
  const maxY = Math.max(...nodes.map((n) => n.py));

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const inner = MAP_SIZE - PADDING * 2;

  const toMapX = (px: number) => PADDING + ((px - minX) / rangeX) * inner;
  const toMapY = (py: number) => PADDING + ((py - minY) / rangeY) * inner;

  return (
    <div className="minimap" aria-label="Minimap navigation">
      <svg width={MAP_SIZE} height={MAP_SIZE}>
        {nodes.map((node) => {
          const isActive = node.id === activeClusterId;
          return (
            <circle
              key={node.id}
              className={`minimap__dot${isActive ? " minimap__dot--active" : ""}`}
              cx={toMapX(node.px)}
              cy={toMapY(node.py)}
              r={isActive ? DOT_RADIUS + 2 : DOT_RADIUS}
              onClick={() => onNavigate(node.id)}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${node.label}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNavigate(node.id);
                }
              }}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </svg>
    </div>
  );
});
