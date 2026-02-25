// src/utils/deepMerge.ts

function isPlainObject(value: any): value is Record<string, any> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * Deeply merges `value` into `source` at `path`
 * - Objects are merged recursively
 * - Arrays are replaced (not merged)
 * - Primitives replace primitives
 * - `undefined` deletes the key (inheritance support)
 */
export default function deepMerge(
  source: any,
  path: (string | number)[],
  value: any
) {
  const next = structuredClone(source);
  let cursor = next;

  // Traverse path, creating objects if needed
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];

    if (!isPlainObject(cursor[key])) {
      cursor[key] = {};
    }

    cursor = cursor[key];
  }

  const lastKey = path[path.length - 1];

  // 🔥 Deletion semantics
  if (value === undefined) {
    delete cursor[lastKey];
    return next;
  }

  const existing = cursor[lastKey];

  // 🔁 Recursive merge for objects
  if (isPlainObject(existing) && isPlainObject(value)) {
    cursor[lastKey] = mergeObjects(existing, value);
    return next;
  }

  // 🔁 Arrays are replaced entirely
  if (Array.isArray(value)) {
    cursor[lastKey] = structuredClone(value);
    return next;
  }

  // 🔁 Primitives replace
  cursor[lastKey] = value;
  return next;
}

/**
 * Recursive object merge
 */
function mergeObjects(
  target: Record<string, any>,
  source: Record<string, any>
) {
  const result = structuredClone(target);

  for (const key of Object.keys(source)) {
    const incoming = source[key];
    const existing = result[key];

    // Deletion
    if (incoming === undefined) {
      delete result[key];
      continue;
    }

    // Recursive object merge
    if (
      isPlainObject(existing) &&
      isPlainObject(incoming)
    ) {
      result[key] = mergeObjects(existing, incoming);
      continue;
    }

    // Arrays & primitives replace
    result[key] = structuredClone(incoming);
  }

  return result;
}