import { memo, KeyboardEvent, type CSSProperties } from "react";
import type { HexNode, RingTier } from "@/shared/types/hex";
import { distinctColor } from "@/shared/lib/colors";

interface Props {
  node: HexNode;
  tier?: RingTier;
  isHovered?: boolean;
  isSelected?: boolean;
  dimmed?: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

const HEX_WIDTH = 96;
const HEX_HEIGHT = 88;

export const HexPill = memo(function HexPill({
  node,
  tier,
  isHovered = false,
  isSelected = false,
  dimmed = false,
  onHover,
  onClick,
}: Props) {
  const color = distinctColor(node.colorIndex);

  const classes = [
    "hex-pill",
    tier ? `hex-pill--${tier}` : "",
    isHovered ? "hex-pill--hovered" : "",
    isSelected ? "hex-pill--selected" : "",
    dimmed ? "hex-pill--dimmed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(node.id);
    }
  };

  return (
    <div
      className={classes}
      role="button"
      tabIndex={0}
      aria-label={node.label}
      aria-pressed={isSelected}
      style={{
        left: node.px - HEX_WIDTH / 2,
        top: node.py - HEX_HEIGHT / 2,
        width: HEX_WIDTH,
        height: HEX_HEIGHT,
        "--hex-color": color,
      } as CSSProperties & { "--hex-color": string }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      onClick={() => onClick(node.id)}
      onKeyDown={handleKeyDown}
    >
      <span className="hex-pill__label">{node.label}</span>
      {node.childCount != null && node.childCount > 0 && (
        <span className="hex-pill__badge">{node.childCount}</span>
      )}
      {"strength" in node && (
        <div
          className="hex-pill__strength-bar"
          style={{ width: `${Math.min(100, ((node as { strength: number }).strength / 5) * 100)}%` }}
        />
      )}
    </div>
  );
});
