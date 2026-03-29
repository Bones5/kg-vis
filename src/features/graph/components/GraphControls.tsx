import { useGraphView } from "../hooks/useGraphView";
import { useGraphUI } from "../hooks/useGraphUI";

interface Props {
  maxLevel?: number;
}

export function GraphControls({ maxLevel = 2 }: Props) {
  const { level, setLevel, expandedClusters, toggleCluster } = useGraphView();
  const { selected, setSelected } = useGraphUI();

  const handleExpand = () => {
    if (selected?.type === "cluster") {
      toggleCluster(selected.id);
    } else if (level < maxLevel) {
      setLevel(level + 1);
    }
  };

  const handleCollapse = () => {
    if (selected?.type === "cluster" && expandedClusters.has(selected.id)) {
      toggleCluster(selected.id);
    } else if (level > 0) {
      setLevel(level - 1);
    }
  };

  const handleReset = () => {
    setLevel(0);
    setSelected(undefined);
  };

  return (
    <div className="graph-controls" role="toolbar" aria-label="Graph controls">
      <button
        className="ctrl-btn"
        onClick={handleCollapse}
        disabled={level === 0 && expandedClusters.size === 0}
        title="Collapse"
      >
        ◀ Collapse
      </button>
      <button
        className="ctrl-btn"
        onClick={handleExpand}
        disabled={level >= maxLevel && !selected}
        title="Expand"
      >
        Expand ▶
      </button>
      <button className="ctrl-btn ctrl-btn--reset" onClick={handleReset} title="Reset view">
        ↺ Reset
      </button>
    </div>
  );
}
