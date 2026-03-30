import { useRef, useMemo } from "react";
import { GraphNode } from "@/shared/types/graph";
import { RiveNode } from "./RiveNode";
import { useGraphView } from "../hooks/useGraphView";

const POOL_SIZE = 20;

interface Props {
  nodes: GraphNode[];
  hovered?: GraphNode;
  selected?: GraphNode;
}

/**
 * Pre-creates a fixed pool of Rive instances.
 * Assigns instances to the first POOL_SIZE visible overlay nodes.
 * Nodes beyond the pool size are rendered as plain divs (no Rive animation).
 */
export function RivePool({ nodes, hovered, selected }: Props) {
  const { lastExpanded } = useGraphView();

  // Stable list of pool slots so Rive instances aren't recreated on every render
  const poolSlots = useRef<string[]>(Array.from({ length: POOL_SIZE }, (_, i) => `pool-${i}`));

  const assigned = useMemo(() => {
    return nodes.slice(0, POOL_SIZE).map((node, idx) => ({
      node,
      slotId: poolSlots.current[idx],
    }));
  }, [nodes]);

  const overflow = useMemo(() => nodes.slice(POOL_SIZE), [nodes]);

  return (
    <>
      {assigned.map(({ node, slotId }) => (
        <div
          key={slotId}
          className={`rive-wrap${lastExpanded === node.id ? " expand" : ""}`}
        >
          <RiveNode
            node={node}
            hovered={hovered?.id === node.id}
            selected={selected?.id === node.id}
            size={node.type === "cluster" ? 56 : 40}
            metric={node.importance ?? 0}
          />
        </div>
      ))}
      {overflow.map((node) => (
        <div
          key={node.id}
          className="rive-node rive-node--fallback"
          style={{
            left: node.x,
            top: node.y,
            width: node.type === "cluster" ? 56 : 40,
            height: node.type === "cluster" ? 56 : 40,
          }}
        />
      ))}
    </>
  );
}
