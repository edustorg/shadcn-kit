import { z } from "zod"

const emptyStringToUndefined = z.literal("").transform(() => undefined)

/**
 * Transforms a Zod schema to treat empty string ("") as undefined,
 * effectively making the field optional for empty strings.
 *
 * Usage:
 * - Validates the schema normally.
 * - Accepts `""` as if the field was omitted.
 *
 * @param schema - Zod schema to transform
 * @returns A schema that accepts the original type or empty string as undefined
 *
 * @example
 * const schema = z.object({
 *   description: zodAsOptionalField(z.string().min(3)),
 * });
 *
 * schema.parse({ description: "" }); // passes, description treated as undefined
 * schema.parse({ description: "abc" }); // passes, valid string
 * schema.parse({}); // passes, description optional
 */
export function zodAsOptionalField<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(emptyStringToUndefined)
}

/**
 * Shorthand for `.nullable().optional()`, producing a `T | null | undefined` field.
 *
 * Use for optional number/date fields. Empty strings are NOT accepted here —
 * coerce them in the form's `onChange` (e.g. `""` -> `null`) to keep input and
 * output types identical for react-hook-form.
 *
 * @param schema - Zod schema to transform
 * @returns A schema accepting the original type, null, or undefined
 *
 * @example
 * const schema = z.object({
 *   displayOrder: zodAsNullableField(z.number().int().min(0)),
 * });
 *
 * schema.parse({ displayOrder: 3 }); // passes
 * schema.parse({ displayOrder: null }); // passes
 * schema.parse({}); // passes
 */
export function zodAsNullableField<T extends z.ZodTypeAny>(schema: T) {
  return schema.nullable().optional()
}
