import { describe, it, expect } from "vitest";
import {
  parseJsonLd,
  validateJsonLd,
  extractEntities,
  JsonLdImportError,
} from "../source/jsonld";
import { normalizeJsonLd } from "../normalizer/jsonld";
import { importJsonLd } from "../index";

// ── Source layer ──────────────────────────────────────────────────────────────

describe("parseJsonLd", () => {
  it("parses a valid JSON object", () => {
    const result = parseJsonLd('{"@id": "http://example.org/alice"}');
    expect(result).toEqual({ "@id": "http://example.org/alice" });
  });

  it("parses a valid JSON array", () => {
    const result = parseJsonLd('[{"@id": "http://example.org/a"}]');
    expect(Array.isArray(result)).toBe(true);
  });

  it("throws JsonLdImportError on invalid JSON text", () => {
    expect(() => parseJsonLd("not json")).toThrow(JsonLdImportError);
  });

  it("throws JsonLdImportError on empty string", () => {
    expect(() => parseJsonLd("")).toThrow(JsonLdImportError);
  });

  it("throws JsonLdImportError on a JSON primitive", () => {
    expect(() => parseJsonLd("42")).toThrow(JsonLdImportError);
  });
});

describe("validateJsonLd", () => {
  it("accepts a plain object", () => {
    const obj = { "@id": "http://example.org/x" };
    expect(validateJsonLd(obj)).toBe(obj);
  });

  it("accepts an array of objects", () => {
    const arr = [{ "@id": "a" }, { "@id": "b" }];
    expect(validateJsonLd(arr)).toBe(arr);
  });

  it("accepts an empty array", () => {
    expect(validateJsonLd([])).toEqual([]);
  });

  it("throws on a string value", () => {
    expect(() => validateJsonLd("hello")).toThrow(JsonLdImportError);
  });

  it("throws on an array containing a non-object", () => {
    expect(() => validateJsonLd([{ "@id": "a" }, 42])).toThrow(JsonLdImportError);
  });
});

describe("extractEntities", () => {
  it("wraps a single object in an array", () => {
    const obj = { "@id": "http://example.org/x", name: "X" };
    expect(extractEntities(obj)).toEqual([obj]);
  });

  it("returns an array as-is", () => {
    const arr = [{ "@id": "a" }, { "@id": "b" }];
    expect(extractEntities(arr)).toEqual(arr);
  });

  it("extracts @graph entities", () => {
    const doc = {
      "@context": {},
      "@graph": [{ "@id": "a" }, { "@id": "b" }],
    };
    expect(extractEntities(doc)).toEqual([{ "@id": "a" }, { "@id": "b" }]);
  });

  it("throws when @graph is not an array", () => {
    expect(() =>
      extractEntities({ "@graph": { "@id": "a" } as unknown as never[] })
    ).toThrow(JsonLdImportError);
  });

  it("throws when @graph contains a non-object", () => {
    expect(() =>
      extractEntities({ "@graph": [{ "@id": "a" }, 42] as unknown as never[] })
    ).toThrow(JsonLdImportError);
  });
});

// ── Normalization layer ───────────────────────────────────────────────────────

describe("normalizeJsonLd — single object", () => {
  it("creates a node from a single JSON-LD object", () => {
    const input = {
      "@id": "http://example.org/alice",
      "@type": "Person",
      name: "Alice",
    };
    const { nodes, edges } = normalizeJsonLd(input);

    expect(nodes).toHaveLength(1);
    expect(nodes[0].id).toBe("http://example.org/alice");
    expect(nodes[0].label).toBe("Alice");
    expect(nodes[0].type).toBe("Person");
    expect(edges).toHaveLength(0);
  });

  it("stores literal properties on the node", () => {
    const input = {
      "@id": "http://example.org/alice",
      name: "Alice",
      age: 30,
      active: true,
    };
    const { nodes } = normalizeJsonLd(input);

    expect(nodes[0].properties).toMatchObject({
      name: "Alice",
      age: 30,
      active: true,
    });
  });

  it("does not include @id or @type in node properties", () => {
    const input = {
      "@id": "http://example.org/alice",
      "@type": "Person",
      name: "Alice",
    };
    const { nodes } = normalizeJsonLd(input);

    expect(nodes[0].properties).not.toHaveProperty("@id");
    expect(nodes[0].properties).not.toHaveProperty("@type");
  });

  it("skips entities without @id", () => {
    const input = { name: "Anonymous" };
    const { nodes } = normalizeJsonLd(input);
    expect(nodes).toHaveLength(0);
  });
});

describe("normalizeJsonLd — array input", () => {
  it("creates nodes from an array of JSON-LD objects", () => {
    const input = [
      { "@id": "http://example.org/alice", name: "Alice" },
      { "@id": "http://example.org/bob", name: "Bob" },
    ];
    const { nodes } = normalizeJsonLd(input);

    expect(nodes).toHaveLength(2);
    const ids = nodes.map((n) => n.id);
    expect(ids).toContain("http://example.org/alice");
    expect(ids).toContain("http://example.org/bob");
  });
});

describe("normalizeJsonLd — @graph input", () => {
  it("creates nodes from a @graph document", () => {
    const input = {
      "@context": { name: "http://schema.org/name" },
      "@graph": [
        { "@id": "http://example.org/alice", name: "Alice" },
        { "@id": "http://example.org/bob", name: "Bob" },
      ],
    };
    const { nodes } = normalizeJsonLd(input);

    expect(nodes).toHaveLength(2);
  });
});

describe("normalizeJsonLd — edge creation", () => {
  it("creates an edge from an object reference", () => {
    const input = {
      "@id": "http://example.org/alice",
      name: "Alice",
      "http://schema.org/knows": { "@id": "http://example.org/bob" },
    };
    const { nodes, edges } = normalizeJsonLd(input);

    expect(edges).toHaveLength(1);
    expect(edges[0].source).toBe("http://example.org/alice");
    expect(edges[0].target).toBe("http://example.org/bob");
    expect(edges[0].predicate).toBe("http://schema.org/knows");
    expect(edges[0].label).toBe("knows");

    // Target node should be created as a stub
    const bob = nodes.find((n) => n.id === "http://example.org/bob");
    expect(bob).toBeDefined();
  });

  it("creates edges from an array of object references", () => {
    const input = {
      "@id": "http://example.org/alice",
      name: "Alice",
      "http://schema.org/knows": [
        { "@id": "http://example.org/bob" },
        { "@id": "http://example.org/carol" },
      ],
    };
    const { edges } = normalizeJsonLd(input);

    expect(edges).toHaveLength(2);
    const targets = edges.map((e) => e.target);
    expect(targets).toContain("http://example.org/bob");
    expect(targets).toContain("http://example.org/carol");
  });

  it("builds a stable edge id from source|predicate|target", () => {
    const input = {
      "@id": "http://example.org/alice",
      "http://schema.org/knows": { "@id": "http://example.org/bob" },
    };
    const { edges } = normalizeJsonLd(input);

    expect(edges[0].id).toBe(
      "http://example.org/alice|http://schema.org/knows|http://example.org/bob"
    );
  });

  it("mixes literals and object references in the same array property", () => {
    const input = {
      "@id": "http://example.org/alice",
      "ex:tag": [
        "developer",
        { "@id": "http://example.org/skill/typescript" },
      ],
    };
    const { nodes, edges } = normalizeJsonLd(input);

    const alice = nodes.find((n) => n.id === "http://example.org/alice")!;
    expect(alice.properties?.["ex:tag"]).toBe("developer");
    expect(edges).toHaveLength(1);
    expect(edges[0].target).toBe("http://example.org/skill/typescript");
  });
});

describe("normalizeJsonLd — node deduplication", () => {
  it("deduplicates nodes with the same @id", () => {
    const input = [
      { "@id": "http://example.org/alice", name: "Alice" },
      { "@id": "http://example.org/alice", age: 30 },
    ];
    const { nodes } = normalizeJsonLd(input);

    expect(nodes).toHaveLength(1);
    expect(nodes[0].label).toBe("Alice");
    expect(nodes[0].properties?.age).toBe(30);
  });

  it("merges properties from duplicate node definitions", () => {
    const input = [
      { "@id": "http://example.org/alice", name: "Alice" },
      { "@id": "http://example.org/alice", occupation: "Engineer" },
    ];
    const { nodes } = normalizeJsonLd(input);

    expect(nodes[0].properties?.name).toBe("Alice");
    expect(nodes[0].properties?.occupation).toBe("Engineer");
  });
});

describe("normalizeJsonLd — edge deduplication", () => {
  it("deduplicates edges with the same source|predicate|target", () => {
    const edge = { "@id": "http://example.org/bob" };
    const input = [
      {
        "@id": "http://example.org/alice",
        "http://schema.org/knows": edge,
      },
      {
        "@id": "http://example.org/alice",
        "http://schema.org/knows": edge,
      },
    ];
    const { edges } = normalizeJsonLd(input);

    expect(edges).toHaveLength(1);
  });
});

describe("normalizeJsonLd — label heuristics", () => {
  it("prefers 'name' over other label candidates", () => {
    const input = {
      "@id": "http://example.org/x",
      name: "Preferred Name",
      label: "Other Label",
    };
    const { nodes } = normalizeJsonLd(input);
    expect(nodes[0].label).toBe("Preferred Name");
  });

  it("falls back to 'label' when 'name' is absent", () => {
    const input = { "@id": "http://example.org/x", label: "My Label" };
    const { nodes } = normalizeJsonLd(input);
    expect(nodes[0].label).toBe("My Label");
  });

  it("falls back to 'rdfs:label'", () => {
    const input = { "@id": "http://example.org/x", "rdfs:label": "RDF Label" };
    const { nodes } = normalizeJsonLd(input);
    expect(nodes[0].label).toBe("RDF Label");
  });

  it("falls back to the last IRI segment when no label property exists", () => {
    const input = { "@id": "http://example.org/myEntity" };
    const { nodes } = normalizeJsonLd(input);
    expect(nodes[0].label).toBe("myEntity");
  });

  it("falls back to the last IRI segment after a hash", () => {
    const input = { "@id": "http://example.org/ontology#Alice" };
    const { nodes } = normalizeJsonLd(input);
    expect(nodes[0].label).toBe("Alice");
  });
});

describe("normalizeJsonLd — type heuristics", () => {
  it("uses @type when present", () => {
    const input = { "@id": "http://example.org/x", "@type": "http://schema.org/Person" };
    const { nodes } = normalizeJsonLd(input);
    expect(nodes[0].type).toBe("Person");
  });

  it("uses first @type from an array", () => {
    const input = {
      "@id": "http://example.org/x",
      "@type": ["http://schema.org/Person", "http://schema.org/Agent"],
    };
    const { nodes } = normalizeJsonLd(input);
    expect(nodes[0].type).toBe("Person");
  });

  it("defaults type to 'Thing' for stub nodes", () => {
    const input = {
      "@id": "http://example.org/alice",
      "http://schema.org/knows": { "@id": "http://example.org/bob" },
    };
    const { nodes } = normalizeJsonLd(input);
    const bob = nodes.find((n) => n.id === "http://example.org/bob")!;
    expect(bob.type).toBe("Thing");
  });
});

describe("normalizeJsonLd — @value nodes", () => {
  it("extracts literal from a JSON-LD @value node", () => {
    const input = {
      "@id": "http://example.org/x",
      name: { "@value": "Alice", "@language": "en" },
    };
    const { nodes } = normalizeJsonLd(input);
    expect(nodes[0].label).toBe("Alice");
    expect(nodes[0].properties?.name).toBe("Alice");
  });
});

describe("normalizeJsonLd — meta", () => {
  it("includes source and generatedAt in meta", () => {
    const { meta } = normalizeJsonLd({ "@id": "http://example.org/x" });
    expect(meta?.source).toBe("json-ld");
    expect(typeof meta?.generatedAt).toBe("string");
  });

  it("merges custom meta fields", () => {
    const { meta } = normalizeJsonLd(
      { "@id": "http://example.org/x" },
      { customField: "hello" }
    );
    expect(meta?.customField).toBe("hello");
  });
});

// ── importJsonLd convenience wrapper ─────────────────────────────────────────

describe("importJsonLd", () => {
  it("parses and normalizes a JSON-LD string end-to-end", () => {
    const text = JSON.stringify({
      "@context": { name: "http://schema.org/name", knows: "http://schema.org/knows" },
      "@id": "http://example.org/alice",
      "@type": "Person",
      name: "Alice",
      knows: { "@id": "http://example.org/bob" },
    });

    const { nodes, edges } = importJsonLd(text);

    const alice = nodes.find((n) => n.id === "http://example.org/alice")!;
    const bob = nodes.find((n) => n.id === "http://example.org/bob")!;

    expect(alice).toBeDefined();
    expect(alice.label).toBe("Alice");
    expect(alice.type).toBe("Person");

    expect(bob).toBeDefined();

    expect(edges).toHaveLength(1);
    expect(edges[0].source).toBe("http://example.org/alice");
    expect(edges[0].target).toBe("http://example.org/bob");
    expect(edges[0].label).toBe("knows");
  });

  it("throws JsonLdImportError on invalid JSON", () => {
    expect(() => importJsonLd("not json")).toThrow(JsonLdImportError);
  });
});
