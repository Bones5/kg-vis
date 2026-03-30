import { useState, useEffect } from "react";
import { GraphPayload } from "@/shared/types/graph";
import { generateMockGraph } from "@/dev/mockGraph";

interface UseGraphDataResult {
  payload: GraphPayload | null;
  loading: boolean;
  error: string | null;
}

export function useGraphData(): UseGraphDataResult {
  const [payload, setPayload] = useState<GraphPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In dev/demo mode, use mock data. In production, fetch from server.
    try {
      const mock = generateMockGraph({ clusterCount: 8, nodesPerCluster: 50, edgeDensity: 0.3 });
      setPayload(mock);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error loading graph");
    } finally {
      setLoading(false);
    }
  }, []);

  return { payload, loading, error };
}
