import { useEffect } from "react";
import { GraphPayload } from "@/shared/types/graph";
import { GraphCanvas } from "./GraphCanvas";
import { GraphOverlayRive } from "./GraphOverlayRive";
import { GraphControls } from "./GraphControls";
import { Breadcrumbs } from "./Breadcrumbs";
import { GraphErrorBoundary } from "./GraphErrorBoundary";
import { useGraphView } from "../hooks/useGraphView";
import { useDevice } from "@/shared/hooks/useDevice";

interface Props {
  payload: GraphPayload;
}

export function GraphView({ payload }: Props) {
  const levels = payload.meta.levels;
  const { maxNodes: deviceMaxNodes } = useDevice();
  const { setMaxNodes } = useGraphView();

  useEffect(() => {
    setMaxNodes(deviceMaxNodes);
  }, [deviceMaxNodes, setMaxNodes]);

  return (
    <div className="graph-view">
      <div className="graph-header">
        <Breadcrumbs />
        <GraphControls maxLevel={levels - 1} />
      </div>
      <div className="graph-canvas-wrap">
        <GraphErrorBoundary>
          <GraphCanvas payload={payload} />
        </GraphErrorBoundary>
        <GraphErrorBoundary
          fallback={<div className="rive-overlay-error">Rive unavailable</div>}
        >
          <GraphOverlayRive payload={payload} />
        </GraphErrorBoundary>
      </div>
    </div>
  );
}
