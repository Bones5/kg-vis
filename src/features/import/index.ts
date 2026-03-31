/**
 * Public API for the kg-vis import pipeline — Version 1.
 *
 * Usage:
 *   import { importJsonLd, parseJsonLd, GraphData } from "@/features/import";
 */

import { parseJsonLd } from "./source/jsonld";
import { normalizeJsonLd } from "./normalizer/jsonld";
import type { GraphData, GraphMeta } from "./types";

// Internal graph model
export type { GraphNode, GraphEdge, GraphMeta, GraphData } from "./types";

// Source layer
export { parseJsonLd, validateJsonLd, extractEntities, JsonLdImportError } from "./source/jsonld";
export type { JsonLdInput, JsonLdObject } from "./source/jsonld";

// Normalization layer
export { normalizeJsonLd } from "./normalizer/jsonld";

/**
 * Convenience function: parse a raw JSON-LD string and return normalized
 * `GraphData` in a single call.
 *
 * @param text  Raw JSON text (JSON-LD object, array, or @graph document).
 * @param meta  Optional extra fields merged into `GraphData.meta`.
 *
 * @throws {JsonLdImportError} on invalid JSON or unsupported shape.
 */
export function importJsonLd(text: string, meta?: Partial<GraphMeta>): GraphData {
  const validated = parseJsonLd(text);
  return normalizeJsonLd(validated, meta);
}
