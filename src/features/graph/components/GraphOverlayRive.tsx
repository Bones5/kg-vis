import { useMemo, Component, ReactNode, ErrorInfo } from "react";
import { GraphPayload, GraphNode } from "@/shared/types/graph";
import { useGraphView } from "../hooks/useGraphView";
import { useGraphUI } from "../hooks/useGraphUI";
import { buildView } from "../lib/graphTransforms";
import { RivePool } from "./RivePool";

interface Props {
  payload: GraphPayload;
}

class RiveErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[RiveErrorBoundary]", error, info.componentStack);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function GraphOverlayRive({ payload }: Props) {
  const { level, maxNodes, lastExpanded } = useGraphView();
  const { hovered, selected } = useGraphUI();

  const overlayNodes = useMemo((): GraphNode[] => {
    const lvl = payload.levels[String(level)];
    if (!lvl) return [];
    const view = buildView(lvl, maxNodes);

    const clusters = view.nodes.filter((n) => n.type === "cluster");

    // Add hovered and selected if not already in clusters
    const extra: GraphNode[] = [];
    const clusterIds = new Set(clusters.map((n) => n.id));
    if (hovered && !clusterIds.has(hovered.id)) extra.push(hovered);
    if (selected && !clusterIds.has(selected.id) && selected.id !== hovered?.id) {
      extra.push(selected);
    }

    return [...clusters, ...extra];
  }, [payload, level, maxNodes, hovered, selected]);

  return (
    <div className={`rive-overlay${lastExpanded ? " has-expansion" : ""}`}>
      <RiveErrorBoundary>
        <RivePool nodes={overlayNodes} hovered={hovered} selected={selected} />
      </RiveErrorBoundary>
    </div>
  );
}
