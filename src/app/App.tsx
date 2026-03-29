import { GraphView } from "@/features/graph/components/GraphView";
import { useGraphData } from "@/features/graph/hooks/useGraphData";

export function App() {
  const { payload, loading, error } = useGraphData();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading graph…</p>
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="app-error">
        <h2>Failed to load graph</h2>
        <p>{error ?? "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <GraphView payload={payload} />
    </div>
  );
}
