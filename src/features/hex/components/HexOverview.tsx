import { useMemo, useState, useCallback } from "react";
import type { GraphPayload } from "@/shared/types/graph";
import type { HexNode } from "@/shared/types/hex";
import { layoutOverview } from "../lib/hexLayout";
import { routeEdges, computeContactPairs } from "../lib/edgeRouter";
import { HexPill } from "./HexPill";
import { RoutedEdges } from "./RoutedEdges";

interface Props {
  payload: GraphPayload;
  onClusterClick: (clusterId: string) => void;
}

const CANVAS_W = 900;
const CANVAS_H = 700;
const OFFSET_X = CANVAS_W / 2;
const OFFSET_Y = CANVAS_H / 2;

export function HexOverview({ payload, onClusterClick }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const nodes: HexNode[] = useMemo(() => layoutOverview(payload), [payload]);

  const contactPairs = useMemo(() => computeContactPairs(nodes), [nodes]);

  const level0 = payload.levels["0"] ?? payload.levels[Object.keys(payload.levels)[0]];

  const routedEdges = useMemo(
    () => routeEdges(nodes, level0.edges, contactPairs),
    [nodes, level0.edges, contactPairs]
  );

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

  const handleClick = useCallback(
    (id: string) => onClusterClick(id),
    [onClusterClick]
  );

  return (
    <div className="hex-overview" style={{ width: CANVAS_W, height: CANVAS_H }}>
      <RoutedEdges
        edges={routedEdges}
        hoveredId={hoveredId}
        width={CANVAS_W}
        height={CANVAS_H}
        offsetX={OFFSET_X}
        offsetY={OFFSET_Y}
      />
      {nodes.map((node) => {
        const dimmed = hoveredId !== null && !connectedIds.has(node.id);
        return (
          <HexPill
            key={node.id}
            node={{ ...node, px: node.px + OFFSET_X, py: node.py + OFFSET_Y }}
            isHovered={hoveredId === node.id}
            dimmed={dimmed}
            onHover={handleHover}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
}
