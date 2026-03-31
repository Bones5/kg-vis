# Import Pipeline — Version 1

JSON-LD source + normalization layer for `kg-vis`.

---

## Internal graph schema

After import from any source, data is normalized into a `GraphData` value
(defined in `src/features/import/types.ts`).

```ts
interface GraphNode {
  id: string;                          // canonical identifier (IRI or local id)
  label: string;                       // human-readable display name
  type?: string;                       // primary class / type (default: "Thing")
  properties?: Record<string, unknown>; // flat map of literal values
  raw?: unknown;                       // original source fragment (for debugging)
}

interface GraphEdge {
  id: string;        // stable: "source|predicate|target"
  source: string;    // source node id
  target: string;    // target node id
  label: string;     // short display label (last IRI segment of predicate)
  predicate?: string; // full predicate IRI / key from source
  properties?: Record<string, unknown>;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  meta?: {
    source?: string;       // e.g. "json-ld"
    generatedAt?: string;  // ISO-8601 timestamp
    [key: string]: unknown;
  };
}
```

> **Note**: `GraphData` is the import pipeline's internal model.
> The visualization layer (`src/shared/types/graph.ts`) uses its own types
> and is not yet wired to the import pipeline.

---

## Supported JSON-LD input shapes (Version 1)

### 1. Single object

```json
{
  "@id": "http://example.org/alice",
  "@type": "Person",
  "name": "Alice",
  "http://schema.org/knows": { "@id": "http://example.org/bob" }
}
```

### 2. Array of objects

```json
[
  { "@id": "http://example.org/alice", "name": "Alice" },
  { "@id": "http://example.org/bob",   "name": "Bob"   }
]
```

### 3. `@graph` document

```json
{
  "@context": { "name": "http://schema.org/name" },
  "@graph": [
    { "@id": "http://example.org/alice", "name": "Alice" },
    { "@id": "http://example.org/bob",   "name": "Bob"   }
  ]
}
```

> **Version 1 scope**: the normalizer treats the input as plain JSON and
> extracts entities using structural heuristics.  Full JSON-LD context
> expansion/compaction (via a library like `jsonld.js`) is out of scope for
> this version and can be added as a pre-processing step later.

---

## Normalization — how it works

```
raw JSON text / parsed JSON
        │
        ▼
  ┌─────────────┐
  │  source/    │  parseJsonLd()  — parse + validate
  │  jsonld.ts  │  extractEntities() — detect shape, flatten to entity array
  └─────────────┘
        │
        ▼
  ┌─────────────────┐
  │  normalizer/    │  normalizeJsonLd()
  │  jsonld.ts      │
  └─────────────────┘
        │
        ▼
    GraphData { nodes[], edges[], meta }
```

### Entity → node

Any entity object with an `@id` field becomes a `GraphNode`.

- `@id` → `node.id`
- `@type` → `node.type` (first value if array; last IRI segment used)
- Literal properties → `node.properties`
- `node.label` chosen by heuristic (see below)

### Property → edge

A property whose value is `{ "@id": "..." }` (or an array containing such
objects) creates a `GraphEdge`:

| GraphEdge field | Source |
|---|---|
| `id` | `"sourceId|predicate|targetId"` |
| `source` | current entity `@id` |
| `target` | referenced entity `@id` |
| `predicate` | property key (full IRI or short name) |
| `label` | last segment of the predicate IRI/key |

Referenced nodes that have no own definition are registered as stub nodes
(`type: "Thing"`, label = last IRI segment) so the graph remains internally
consistent.

### Property → literal

Values that are plain strings, numbers, booleans, or JSON-LD `@value` nodes
are collected into `node.properties`.  Arrays of literals are stored as a
single value when the array has one item, or as a JS array when there are
multiple.

### Deduplication

- **Nodes**: merged by `@id`.  Properties are deep-merged.  Labels from an
  explicit label candidate (e.g. `name`) win over fallback IRI-segment labels.
- **Edges**: deduplicated by `"source|predicate|target"`.

### Label heuristics (highest priority first)

1. `name`
2. `label`
3. `rdfs:label`
4. `title`
5. `displayName`
6. `skos:prefLabel`
7. Last segment of the `@id` IRI (split on `/` or `#`)

### Type heuristics

1. First value of `@type` (last IRI segment used as short name)
2. Fallback: `"Thing"`

---

## Public API

```ts
import {
  // Main entry point
  importJsonLd,      // parse raw JSON string → GraphData

  // Source layer (lower-level)
  parseJsonLd,       // string → JsonLdInput (throws JsonLdImportError)
  validateJsonLd,    // unknown → JsonLdInput (throws JsonLdImportError)
  extractEntities,   // JsonLdInput → JsonLdObject[]

  // Normalization layer
  normalizeJsonLd,   // JsonLdInput → GraphData

  // Error type
  JsonLdImportError,

  // Types
  type GraphData,
  type GraphNode,
  type GraphEdge,
  type GraphMeta,
  type JsonLdInput,
  type JsonLdObject,
} from "@/features/import";
```

### Minimal example

```ts
import { importJsonLd } from "@/features/import";

const graph = importJsonLd(`{
  "@id": "http://example.org/alice",
  "@type": "Person",
  "name": "Alice",
  "http://schema.org/knows": { "@id": "http://example.org/bob" }
}`);

console.log(graph.nodes); // [{ id: "…/alice", label: "Alice", type: "Person" }, …]
console.log(graph.edges); // [{ source: "…/alice", target: "…/bob", label: "knows" }]
```

---

## Planned future versions

| Version | Capability |
|---|---|
| 2 | URL fetch + embedded JSON-LD extraction from web pages |
| 3 | SPARQL / RDF dump connector (Turtle, N-Triples) |
| 4 | External KG connectors (Wikidata, DBpedia) |
