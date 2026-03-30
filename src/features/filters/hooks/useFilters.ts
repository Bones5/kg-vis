// TODO (Milestone 6): Implement useFilters hook
// Should maintain active filters and expose setters.

export interface FilterState {
  types: string[];
  clusters: string[];
  importanceMin: number;
  importanceMax: number;
}

export function useFilters() {
  return {
    filters: {
      types: [],
      clusters: [],
      importanceMin: 0,
      importanceMax: 1,
    } as FilterState,
    setFilters: (_f: Partial<FilterState>) => {},
    resetFilters: () => {},
  };
}
