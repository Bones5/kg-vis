import ForceGraph2D, { NodeObject, LinkObject } from "react-force-graph-2d";
import { useMemo, useCallback } from "react";
import { GraphPayload, GraphNode } from "@/shared/types/graph";
import { buildView } from "../lib/graphTransforms";
import { useGraphView } from "../hooks/useGraphView";
import { useGraphUI } from "../hooks/useGraphUI";
import { CLUSTER_COLOR, WORD_COLOR, HOVERED_COLOR, SELECTED_COLOR, EDGE_COLOR } from "@/shared/lib/colors";

interface Props {
  payload: GraphPayload;
}

export function GraphCanvas({ payload }: Props) {
  const { level, maxNodes } = useGraphView();
  const { setHovered, setSelected, hovered, selected } = useGraphUI();

  const view = useMemo(() => {
    const lvl = payload.levels[String(level)];
    if (!lvl) return { nodes: [], edges: [] };
    return buildView(lvl, maxNodes);
  }, [payload, level, maxNodes]);

  const handleNodeHover = useCallback(
    (node: NodeObject | null) => {
      setHovered(node ? (node as unknown as GraphNode) : undefined);
    },
    [setHovered]
  );

  const handleNodeClick = useCallback(
    (node: NodeObject) => {
      setSelected(node as unknown as GraphNode);
    },
    [setSelected]
  );

  const nodeColor = useCallback(
    (node: NodeObject) => {
      const n = node as unknown as GraphNode;
      if (selected?.id === n.id) return SELECTED_COLOR;
      if (hovered?.id === n.id) return HOVERED_COLOR;
      return n.type === "cluster" ? CLUSTER_COLOR : WORD_COLOR;
    },
    [hovered, selected]
  );

  const nodeRelSize = useCallback(
    (node: NodeObject) => {
      const n = node as unknown as GraphNode;
      return n.type === "cluster" ? 10 : 5;
    },
    []
  );

  const linkColor = useCallback((_link: LinkObject) => EDGE_COLOR, []);

  const linkWidth = useCallback(
    (link: LinkObject) => (link as { weight?: number }).weight ?? 1,
    []
  );

  // react-force-graph-2d uses `links` instead of `edges`
  const graphData = useMemo(
    () => ({ nodes: view.nodes as unknown as NodeObject[], links: view.edges as unknown as LinkObject[] }),
    [view]
  );

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="label"
      nodeRelSize={6}
      nodeColor={nodeColor}
      nodeVal={nodeRelSize}
      linkColor={linkColor}
      linkWidth={linkWidth}
      onNodeHover={handleNodeHover}
      onNodeClick={handleNodeClick}
      cooldownTicks={0}
      d3AlphaDecay={1}
      d3VelocityDecay={1}
    />
  );
}
