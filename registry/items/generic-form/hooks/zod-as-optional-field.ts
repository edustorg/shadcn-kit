import z from "zod"

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
