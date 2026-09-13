export type SearchParamsLike = Pick<URLSearchParams, "get" | "getAll">;

/**
 * Reads a search param as an array of strings.
 *
 * Supports both comma-separated values (`?assignee=id1,id2`) and repeated keys
 * (`?assignee=id1&assignee=id2`). Empty values are trimmed and dropped.
 *
 * @param params - URLSearchParams-like object (e.g. from `useSearchParams()`)
 * @param key - The search param key
 * @param delimiter - Value delimiter (default: ",")
 * @returns A non-empty array of values, or `undefined` when the key is absent
 *   or all values are empty.
 *
 * @example
 * getArrayParam(new URLSearchParams("?assignee=id1,id2"), "assignee")
 * // => ["id1", "id2"]
 *
 * @example
 * getArrayParam(new URLSearchParams("?assignee=id1&assignee=id2"), "assignee")
 * // => ["id1", "id2"]
 *
 * @example
 * getArrayParam(new URLSearchParams("?page=1"), "assignee")
 * // => undefined
 */
export function getArrayParam(
  params: SearchParamsLike,
  key: string,
  delimiter = ",",
): string[] | undefined {
  const values = params
    .getAll(key)
    .flatMap((value) => value.split(delimiter))
    .map((value) => value.trim())
    .filter(Boolean);

  return values.length > 0 ? values : undefined;
}

/**
 * Reads a search param as a boolean.
 *
 * Only the literal strings `"true"` and `"false"` are recognized.
 *
 * @param params - URLSearchParams-like object (e.g. from `useSearchParams()`)
 * @param key - The search param key
 * @returns `true`, `false`, or `undefined` when the key is absent or non-boolean.
 *
 * @example
 * getBooleanParam(new URLSearchParams("?filter_by_unassigned=true"), "filter_by_unassigned")
 * // => true
 *
 * @example
 * getBooleanParam(new URLSearchParams("?page=1"), "filter_by_unassigned")
 * // => undefined
 */
export function getBooleanParam(
  params: SearchParamsLike,
  key: string,
): boolean | undefined {
  const value = params.get(key);

  if (value === "true") return true;
  if (value === "false") return false;

  return undefined;
}

/**
 * Reads a numeric search param.
 *
 * @param params - URLSearchParams-like object (e.g. from `useSearchParams()`)
 * @param key - The search param key
 * @param fallback - Value returned when the key is absent or not a number
 * @returns The parsed number, the fallback, or `undefined`.
 *
 * @example
 * getNumberParam(new URLSearchParams("?page=3"), "page", 1)
 * // => 3
 *
 * @example
 * getNumberParam(new URLSearchParams("?page=abc"), "page", 1)
 * // => 1
 *
 * @example
 * getNumberParam(new URLSearchParams("?page=3"), "page")
 * // => 3
 */
export function getNumberParam(
  params: SearchParamsLike,
  key: string,
  fallback?: number,
): number | undefined {
  const value = params.get(key);

  if (value === null || value === "") return fallback;

  const parsed = Number(value);

  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Reads a search param as a numeric range in `"from,to"` shape.
 *
 * Either bound may be omitted. Non-numeric bounds are dropped.
 *
 * @param params - URLSearchParams-like object (e.g. from `useSearchParams()`)
 * @param key - The search param key
 * @param delimiter - Value delimiter (default: ",")
 * @returns `{ from?, to? }` with at least one numeric bound, or `undefined`
 *   when the key is absent.
 *
 * @example
 * getRangeParam(new URLSearchParams("?dueDate=1710000000000,1712500000000"), "dueDate")
 * // => { from: 1710000000000, to: 1712500000000 }
 *
 * @example
 * getRangeParam(new URLSearchParams("?dueDate=,1712500000000"), "dueDate")
 * // => { to: 1712500000000 }
 *
 * @example
 * getRangeParam(new URLSearchParams("?page=1"), "dueDate")
 * // => undefined
 */
export function getRangeParam(
  params: SearchParamsLike,
  key: string,
  delimiter = ",",
): { from?: number; to?: number } | undefined {
  const values = params.get(key)?.split(delimiter).map((value) => value.trim());

  if (!values) return undefined;

  const from = values[0] ? Number(values[0]) : undefined;
  const to = values[1] ? Number(values[1]) : undefined;

  if (from === undefined && to === undefined) return undefined;

  return {
    ...(from !== undefined && !Number.isNaN(from) ? { from } : {}),
    ...(to !== undefined && !Number.isNaN(to) ? { to } : {}),
  };
}