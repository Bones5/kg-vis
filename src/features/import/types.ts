/**
 * Internal graph model used across the import pipeline.
 *
 * These types represent normalized graph data after ingestion from any source
 * (JSON-LD, RDF, SPARQL, etc.) and before the data reaches the visualization
 * layer.  The visualization layer uses its own types in `shared/types/graph.ts`.
 */

export interface GraphNode {
  /** Canonical unique identifier, typically an IRI or a local id. */
  id: string;
  /** Human-readable display name derived via label-selection heuristics. */
  label: string;
  /** Primary class/type for styling and filtering; defaults to `"Thing"`. */
  type?: string;
  /** Flat map of literal property values extracted from the source entity. */
  properties?: Record<string, unknown>;
  /** Original source fragment kept for debugging / round-trip scenarios. */
  raw?: unknown;
}

export interface GraphEdge {
  /** Stable edge identifier derived as `"source|predicate|target"`. */
  id: string;
  /** `id` of the source node. */
  source: string;
  /** `id` of the target node. */
  target: string;
  /** Short display-friendly label derived from the predicate. */
  label: string;
  /** Full predicate IRI or key preserved from the source. */
  predicate?: string;
  /** Optional property bag for edge metadata. */
  properties?: Record<string, unknown>;
}

export interface GraphMeta {
  /** Identifies the import source (e.g. `"json-ld"`). */
  source?: string;
  /** ISO-8601 timestamp of when the graph data was generated. */
  generatedAt?: string;
  [key: string]: unknown;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  meta?: GraphMeta;
}
