/**
 * Normalization layer — JSON-LD → internal graph model.
 *
 * Rules:
 * - Any entity object with `@id` becomes a `GraphNode`.
 * - Properties whose values are objects with `@id` create `GraphEdge`s.
 * - Properties whose values are literals (string/number/boolean) or
 *   JSON-LD `@value` nodes are collected as node `properties`.
 * - Arrays are supported for both literals and object references.
 * - `@type` maps to `node.type`.
 * - Nodes are deduplicated by `id`; later definitions are deep-merged.
 * - Edges are deduplicated by the stable key `"source|predicate|target"`.
 * - Referenced nodes that have no explicit definition are registered as
 *   stub nodes (id + inferred label) so the graph stays internally consistent.
 *
 * Label heuristics (first match wins):
 *   name → label → rdfs:label → title → displayName → skos:prefLabel
 *   → last IRI segment
 *
 * Type heuristics:
 *   @type (first value if array) → fallback `"Thing"`
 */

import type { GraphNode, GraphEdge, GraphData, GraphMeta } from "../types";
import { extractEntities } from "../source/jsonld";
import type { JsonLdInput, JsonLdObject } from "../source/jsonld";

// ── JSON-LD keyword set ───────────────────────────────────────────────────────

const JSONLD_KEYWORDS = new Set([
  "@context",
  "@graph",
  "@id",
  "@type",
  "@value",
  "@language",
  "@container",
  "@list",
  "@set",
  "@reverse",
  "@base",
  "@vocab",
  "@included",
  "@direction",
  "@nest",
  "@prefix",
  "@protected",
  "@version",
]);

// ── Label candidates (ordered by priority) ───────────────────────────────────

const LABEL_KEYS = [
  "name",
  "label",
  "rdfs:label",
  "title",
  "displayName",
  "skos:prefLabel",
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Return the last non-empty segment of an IRI or plain string. */
function iriSegment(id: string): string {
  const parts = id.split(/[/#]/).filter(Boolean);
  return parts[parts.length - 1] ?? id;
}

/**
 * Extract a scalar literal from a value.
 * Handles plain JS primitives and JSON-LD `{ "@value": ... }` nodes.
 * Returns `undefined` when the value is not literal.
 */
function extractLiteral(value: unknown): string | number | boolean | undefined {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    if ("@value" in obj) {
      const v = obj["@value"];
      if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
        return v;
      }
    }
  }
  return undefined;
}

/** Return `true` when the entity has at least one explicit label candidate. */
function hasExplicitLabel(entity: JsonLdObject): boolean {
  for (const key of LABEL_KEYS) {
    if (!(key in entity)) continue;
    const val = entity[key];
    const items = Array.isArray(val) ? val : [val];
    for (const item of items) {
      const lit = extractLiteral(item);
      if (typeof lit === "string" && lit) return true;
    }
  }
  return false;
}

/** Pick a human-readable label from an entity object. */
function pickLabel(entity: JsonLdObject): string {
  for (const key of LABEL_KEYS) {
    if (!(key in entity)) continue;
    const val = entity[key];

    if (Array.isArray(val)) {
      for (const item of val) {
        const lit = extractLiteral(item);
        if (typeof lit === "string" && lit) return lit;
      }
    } else {
      const lit = extractLiteral(val);
      if (typeof lit === "string" && lit) return lit;
    }
  }

  const id = entity["@id"];
  if (typeof id === "string" && id) return iriSegment(id);

  return "Unknown";
}

/** Derive a short display type string from `@type`. */
function pickType(entity: JsonLdObject): string | undefined {
  const t = entity["@type"];
  if (typeof t === "string" && t) return iriSegment(t);
  if (Array.isArray(t) && t.length > 0) {
    const first = t[0];
    if (typeof first === "string" && first) return iriSegment(first);
  }
  return undefined;
}

/** Build a short edge label from the predicate IRI or key. */
function edgeLabel(predicate: string): string {
  return iriSegment(predicate);
}

/** Build a stable, deterministic edge id. */
function makeEdgeId(source: string, predicate: string, target: string): string {
  return `${source}|${predicate}|${target}`;
}

// ── Core normalizer ───────────────────────────────────────────────────────────

/**
 * Normalize a JSON-LD input (single object, array, or `@graph` document) into
 * the internal `GraphData` format.
 *
 * @param input  - Validated JSON-LD value from the source layer.
 * @param meta   - Optional extra fields merged into `GraphData.meta`.
 */
export function normalizeJsonLd(
  input: JsonLdInput,
  meta?: Partial<GraphMeta>
): GraphData {
  const entities = extractEntities(input);

  const nodesMap = new Map<string, GraphNode>();
  const edgesMap = new Map<string, GraphEdge>();

  /** Ensure a stub node exists for a referenced id. */
  function touchNode(id: string): void {
    if (!nodesMap.has(id)) {
      nodesMap.set(id, {
        id,
        label: iriSegment(id),
        type: "Thing",
      });
    }
  }

  /** Register an edge, deduplicating by stable id. */
  function registerEdge(
    sourceId: string,
    predicate: string,
    targetId: string
  ): void {
    touchNode(targetId);
    const edgeId = makeEdgeId(sourceId, predicate, targetId);
    if (!edgesMap.has(edgeId)) {
      edgesMap.set(edgeId, {
        id: edgeId,
        source: sourceId,
        target: targetId,
        label: edgeLabel(predicate),
        predicate,
      });
    }
  }

  for (const entity of entities) {
    const id = entity["@id"];
    if (typeof id !== "string" || !id) {
      // Entities without @id cannot be meaningfully represented as named nodes.
      continue;
    }

    // Build the node
    const type = pickType(entity);
    const node: GraphNode = {
      id,
      label: pickLabel(entity),
      type: type ?? "Thing",
      raw: entity,
    };

    // Collect literal properties and create edges for object references
    const properties: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(entity)) {
      if (JSONLD_KEYWORDS.has(key)) continue;

      const items = Array.isArray(value) ? value : [value];
      const literals: (string | number | boolean)[] = [];

      for (const item of items) {
        const lit = extractLiteral(item);
        if (lit !== undefined) {
          literals.push(lit);
          continue;
        }

        // Object reference with @id → edge
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          const ref = (item as Record<string, unknown>)["@id"];
          if (typeof ref === "string" && ref) {
            registerEdge(id, key, ref);
          }
        }
      }

      if (literals.length === 1) {
        properties[key] = literals[0];
      } else if (literals.length > 1) {
        properties[key] = literals;
      }
    }

    if (Object.keys(properties).length > 0) {
      node.properties = properties;
    }

    // Merge with any existing stub node (deduplication)
    const existing = nodesMap.get(id);
    if (existing) {
      // Preserve the existing label when the new entity only has a fallback
      // (IRI segment) label and the existing node already has a better one.
      const mergedLabel = hasExplicitLabel(entity) ? node.label : existing.label;
      nodesMap.set(id, {
        ...existing,
        ...node,
        label: mergedLabel,
        properties:
          existing.properties || node.properties
            ? { ...existing.properties, ...node.properties }
            : undefined,
      });
    } else {
      nodesMap.set(id, node);
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values()),
    meta: {
      source: "json-ld",
      generatedAt: new Date().toISOString(),
      ...meta,
    },
  };
}
