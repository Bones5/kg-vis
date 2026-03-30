import { useMemo, useState, useCallback } from "react";
import type { GraphPayload } from "@/shared/types/graph";
import type { HexNode } from "@/shared/types/hex";
import { layoutRing } from "../lib/hexLayout";
import { routeEdges, computeContactPairs } from "../lib/edgeRouter";
import { HexPill } from "./HexPill";
import { RoutedEdges } from "./RoutedEdges";
import { RiveNode } from "@/features/graph/components/RiveNode";

interface Props {
  centerId: string;
  payload: GraphPayload;
  onClusterClick: (clusterId: string) => void;
}

const CANVAS_W = 900;
const CANVAS_H = 700;
const OFFSET_X = CANVAS_W / 2;
const OFFSET_Y = CANVAS_H / 2;

export function HexRing({ centerId, payload, onClusterClick }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { center, rings, offMap } = useMemo(
    () => layoutRing(centerId, payload),
    [centerId, payload]
  );

  const allNodes: HexNode[] = useMemo(() => [center, ...rings], [center, rings]);

  const contactPairs = useMemo(() => computeContactPairs(allNodes), [allNodes]);

  const level0 = payload.levels["0"] ?? payload.levels[Object.keys(payload.levels)[0]];

  const routedEdges = useMemo(() => {
    const allEdges = level0.edges.filter((e) => {
      const src = e.source as string;
      const tgt = e.target as string;
      const ids = new Set(allNodes.map((n) => n.id));
      return ids.has(src) && ids.has(tgt);
    });
    return routeEdges(allNodes, allEdges, contactPairs);
  }, [allNodes, level0.edges, contactPairs]);

  const connectedIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const ids = new Set<string>([hoveredId]);
    for (const edge of routedEdges) {
      if (edge.sourceId === hoveredId) ids.add(edge.targetId);
      if (edge.targetId === hoveredId) ids.add(edge.sourceId);
    }
    for (const pair of contactPairs) {
      const [a, b] = pair.split(":");
      if (a === hoveredId) ids.add(b);
      if (b === hoveredId) ids.add(a);
    }
    return ids;
  }, [hoveredId, routedEdges, contactPairs]);

  const handleHover = useCallback((id: string | null) => setHoveredId(id), []);
  const handleClick = useCallback((id: string) => onClusterClick(id), [onClusterClick]);

  // Center node rendered with Rive
  const centerNode = {
    id: center.id,
    type: center.type as "cluster" | "word",
    label: center.label,
    importance: center.importance,
    x: center.px + OFFSET_X,
    y: center.py + OFFSET_Y,
  };

  return (
    <div className="hex-ring" style={{ width: CANVAS_W, height: CANVAS_H }}>
      <RoutedEdges
        edges={routedEdges}
        hoveredId={hoveredId}
        width={CANVAS_W}
        height={CANVAS_H}
        offsetX={OFFSET_X}
        offsetY={OFFSET_Y}
      />

      {/* Center node with Rive */}
      <div
        style={{
          position: "absolute",
          left: center.px + OFFSET_X - 56,
          top: center.py + OFFSET_Y - 56,
          width: 112,
          height: 112,
          zIndex: 2,
        }}
      >
        <RiveNode
          node={centerNode}
          hovered={hoveredId === center.id}
          selected={true}
          size={112}
          metric={center.importance}
        />
      </div>

      {/* Ring nodes */}
      {rings.map((node) => {
        const dimmed = hoveredId !== null && !connectedIds.has(node.id);
        return (
          <HexPill
            key={node.id}
            node={{ ...node, px: node.px + OFFSET_X, py: node.py + OFFSET_Y }}
            tier={node.tier}
            isHovered={hoveredId === node.id}
            dimmed={dimmed}
            onHover={handleHover}
            onClick={handleClick}
          />
        );
      })}

      {/* Off-map stubs */}
      {offMap.map((stub) => {
        const stubX = OFFSET_X + Math.cos(stub.exitAngle) * 320;
        const stubY = OFFSET_Y + Math.sin(stub.exitAngle) * 320;
        return (
          <div
            key={stub.targetCluster}
            className="hex-ring__stub"
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${stub.targetLabel}`}
            style={{
              left: stubX,
              top: stubY,
              transform: `translate(-50%, -50%) rotate(${(stub.exitAngle * 180) / Math.PI}deg)`,
            }}
            onClick={() => onClusterClick(stub.targetCluster)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClusterClick(stub.targetCluster);
              }
            }}
          >
            <span className="hex-ring__stub-label">{stub.targetLabel}</span>
            <span className="hex-ring__stub-arrow">→</span>
          </div>
        );
      })}
    </div>
  );
}
