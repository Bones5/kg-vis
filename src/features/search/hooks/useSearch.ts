// TODO (Milestone 5): Implement useSearch hook
// Should maintain query state and return matched node IDs.

export function useSearch() {
  return { query: "", results: [] as string[], setQuery: (_q: string) => {} };
}
