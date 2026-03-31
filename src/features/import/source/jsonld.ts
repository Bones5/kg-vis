/**
 * Source layer — JSON-LD ingestion.
 *
 * Responsibilities:
 * - Parse / validate raw JSON text or already-parsed values.
 * - Detect the three supported JSON-LD shapes (single object, array, @graph).
 * - Return a flat array of entity objects ready for the normalization layer.
 *
 * This module does *not* expand or compact JSON-LD contexts; it treats the
 * input as plain JSON and extracts entities using structural heuristics.
 * Full JSON-LD processing (context resolution, term expansion) can be layered
 * on top in a later version.
 */

/** A plain JSON object — the basic unit of a JSON-LD document. */
export type JsonLdObject = Record<string, unknown>;

/** The accepted input shapes for the JSON-LD source layer. */
export type JsonLdInput = JsonLdObject | JsonLdObject[];

/**
 * Errors thrown by the import source layer.
 * Callers can `catch (e) { if (e instanceof JsonLdImportError) ... }` to
 * distinguish import failures from unexpected runtime errors.
 */
export class JsonLdImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JsonLdImportError";
  }
}

/**
 * Parse a raw JSON string and validate it as a JSON-LD-compatible input.
 *
 * @throws {JsonLdImportError} if the text is not valid JSON or the parsed
 *   value is neither an object nor an array of objects.
 */
export function parseJsonLd(text: string): JsonLdInput {
  if (typeof text !== "string" || text.trim() === "") {
    throw new JsonLdImportError("Invalid JSON-LD: input must be a non-empty string");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new JsonLdImportError("Invalid JSON-LD: could not parse input as JSON");
  }

  return validateJsonLd(parsed);
}

/**
 * Validate an already-parsed value as a JSON-LD-compatible input.
 *
 * Accepts:
 * - a single JSON object (with or without `@id`, `@type`, `@graph`, etc.)
 * - an array of JSON objects
 *
 * @throws {JsonLdImportError} if the value is not an object or an array of
 *   objects.
 */
export function validateJsonLd(value: unknown): JsonLdInput {
  if (Array.isArray(value)) {
    if (value.length === 0) return [];

    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new JsonLdImportError(
          `Invalid JSON-LD: array item at index ${i} must be a plain object`
        );
      }
    }
    return value as JsonLdObject[];
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as JsonLdObject;
  }

  throw new JsonLdImportError(
    "Invalid JSON-LD: input must be a JSON object or an array of JSON objects"
  );
}

/**
 * Extract a flat array of entity objects from any supported JSON-LD shape:
 *
 * - **Single object** — returned as a one-element array.
 * - **Array of objects** — returned as-is.
 * - **`@graph` document** — the value of the `@graph` key is returned.
 *
 * @throws {JsonLdImportError} if a `@graph` key exists but its value is not
 *   an array of objects.
 */
export function extractEntities(input: JsonLdInput): JsonLdObject[] {
  if (Array.isArray(input)) {
    return input;
  }

  // @graph document
  if ("@graph" in input) {
    const graph = input["@graph"];
    if (!Array.isArray(graph)) {
      throw new JsonLdImportError(
        "Invalid JSON-LD: @graph must be an array of objects"
      );
    }
    for (let i = 0; i < graph.length; i++) {
      const item = graph[i];
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new JsonLdImportError(
          `Invalid JSON-LD: @graph item at index ${i} must be a plain object`
        );
      }
    }
    return graph as JsonLdObject[];
  }

  return [input];
}
