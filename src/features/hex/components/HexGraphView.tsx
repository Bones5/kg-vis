import { useState, useCallback, useMemo } from "react";
import type { GraphPayload } from "@/shared/types/graph";
import type { ViewMode } from "@/shared/types/hex";
import { GraphErrorBoundary } from "@/features/graph/components/GraphErrorBoundary";
import { HexOverview } from "./HexOverview";
import { HexRing } from "./HexRing";
import { Minimap } from "./Minimap";
import { layoutOverview } from "../lib/hexLayout";

interface Props {
  payload: GraphPayload;
}

const OVERVIEW_W = 900;
const OVERVIEW_H = 700;
const OVERVIEW_OFFSET_X = OVERVIEW_W / 2;
const OVERVIEW_OFFSET_Y = OVERVIEW_H / 2;

export function HexGraphView({ payload }: Props) {
  const [mode, setMode] = useState<ViewMode>("overview");
  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  const overviewNodes = useMemo(() => layoutOverview(payload), [payload]);

  const handleClusterClick = useCallback((clusterId: string) => {
    setActiveCluster(clusterId);
    setMode("cluster-ring");
  }, []);

  const handleBreadcrumbAll = useCallback(() => {
    setMode("overview");
    setActiveCluster(null);
  }, []);

  const handleMinimapNavigate = useCallback((clusterId: string) => {
    setActiveCluster(clusterId);
    setMode("cluster-ring");
  }, []);

  const activeLabel = useMemo(() => {
    if (!activeCluster) return null;
    return overviewNodes.find((n) => n.id === activeCluster)?.label ?? activeCluster;
  }, [activeCluster, overviewNodes]);

  return (
    <div className="hex-graph-view">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="View navigation">
        <button
          className={`breadcrumbs__item${mode === "overview" ? " breadcrumbs__item--active" : ""}`}
          onClick={handleBreadcrumbAll}
          aria-current={mode === "overview" ? "page" : undefined}
        >
          All
        </button>
        {activeLabel && (
          <>
            <span className="breadcrumbs__sep" aria-hidden="true">›</span>
            <span className="breadcrumbs__item breadcrumbs__item--active" aria-current="page">
              {activeLabel}
            </span>
          </>
        )}
      </nav>

      {/* Main canvas */}
      <div className="hex-canvas-wrap">
        <GraphErrorBoundary>
          {mode === "overview" && (
            <HexOverview payload={payload} onClusterClick={handleClusterClick} />
          )}
          {(mode === "cluster-ring" || mode === "node-ring") && activeCluster && (
            <HexRing
              centerId={activeCluster}
              payload={payload}
              onClusterClick={handleClusterClick}
            />
          )}
        </GraphErrorBoundary>
      </div>

      {/* Minimap — only when drilled in */}
      {mode !== "overview" && (
        <Minimap
          nodes={overviewNodes.map((n) => ({
            ...n,
            px: n.px + OVERVIEW_OFFSET_X,
            py: n.py + OVERVIEW_OFFSET_Y,
          }))}
          activeClusterId={activeCluster}
          onNavigate={handleMinimapNavigate}
        />
      )}
    </div>
  );
}
