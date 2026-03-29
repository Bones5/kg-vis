// TODO (Milestone 6): Implement filter types

export interface FilterCriteria {
  types?: string[];
  clusters?: string[];
  importanceMin?: number;
  importanceMax?: number;
  query?: string;
}
