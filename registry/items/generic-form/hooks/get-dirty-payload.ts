/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldNamesMarkedBoolean, FieldValues } from "react-hook-form"

/**
 * Produces a payload containing only the fields that React Hook Form marked as dirty,
 * while preserving any identifying fields (like `id`) for nested objects.
 *
 * Primarily used for building PATCH payloads, ensuring unchanged records
 * still include their `id` so the backend can match them.
 *
 * @template T - The shape of your form values.
 * @param values - The current full form values (`form.getValues()`).
 * @param dirtyFields - The `formState.dirtyFields` object from React Hook Form.
 * @returns A new object containing only dirty fields plus their required identifiers.
 *
 * @example
 * const dirtyPayload = getDirtyPayload(form.getValues(), form.formState.dirtyFields)
 * await api.patchProduct(dirtyPayload)
 */

export function getDirtyPayload<T extends FieldValues>(
  values: T,
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<T>>>,
): Partial<T> {
  // detect array branch early
  if (Array.isArray(values)) {
    const result: any[] = []

    values.forEach((item, index) => {
      const dirtyEntry = (dirtyFields as any)?.[index]
      if (dirtyEntry) {
        if (dirtyEntry === true) {
          // Include entire item if dirty and has a value
          result.push(item)
        } else if (
          typeof dirtyEntry === "object" &&
          item &&
          typeof item === "object"
        ) {
          const nested = getDirtyPayload(
            item,
            dirtyEntry as Partial<FieldNamesMarkedBoolean<any>>,
          )

          // preserve id if present
          if (item.id && !("id" in nested)) nested.id = item.id

          // Only include nested if it has keys
          if (Object.keys(nested).length > 0) {
            result.push(nested)
          }
        }
      }
    })

    return result as any
  }

  const payload: Partial<T> = {}

  for (const key in dirtyFields) {
    if (!Object.prototype.hasOwnProperty.call(dirtyFields, key)) continue

    const dirtyValue = dirtyFields[key]
    const currentValue = values[key]

    if (currentValue === undefined) continue

    // Include if dirty and has a meaningful value
    if (dirtyValue === true) {
      ;(payload as any)[key] = currentValue
    } else if (
      typeof dirtyValue === "object" &&
      currentValue &&
      typeof currentValue === "object"
    ) {
      const nested = getDirtyPayload(
        currentValue,
        dirtyValue as Partial<FieldNamesMarkedBoolean<any>>,
      )

      // preserve id if present
      if ("id" in currentValue && currentValue.id && !("id" in nested)) {
        ;(nested as any).id = currentValue.id
      }

      // Only include nested if it has keys OR if it has an id (to preserve reference)
      if (
        Object.keys(nested).length > 0 ||
        ("id" in currentValue && currentValue.id)
      ) {
        ;(payload as any)[key] = nested
      }
    }
  }

  // top‑level id preservation
  if ("id" in values && (values as any).id && !("id" in payload)) {
    ;(payload as any).id = (values as any).id
  }

  return payload
}
