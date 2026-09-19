import {
  differenceInDays,
  format,
  isThisYear,
  isToday,
  isYesterday,
} from "date-fns"

export type DateFormatVariant =
  | "relative"
  | "relative-short"
  | "short"
  | "medium"
  | "long"
  | "full"
  | "time-only"
  | "date-only"
  | "iso"

const VARIANT_FORMATS: Record<
  Exclude<DateFormatVariant, "relative" | "relative-short">,
  string
> = {
  short: "MMM d, yyyy",
  medium: "MMM d, yyyy h:mm a",
  long: "MMMM d, yyyy h:mm a",
  full: "EEEE, MMMM d, yyyy 'at' h:mm a",
  "time-only": "h:mm a",
  "date-only": "MMM d, yyyy",
  iso: "yyyy-MM-dd'T'HH:mm:ssXXX",
}

function parseDate(
  date: Date | string | number | null | undefined,
): Date | null {
  if (!date) return null
  const d =
    typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Formats a date using the specified variant.
 *
 * @param date - The date to format (Date, ISO string, timestamp, or null/undefined)
 * @param variant - The format variant to use (default: "medium")
 * @returns Formatted date string, or "-" if date is invalid
 *
 * @example
 * ```ts
 * // Input: new Date("2026-06-16T10:35:00Z") (today)
 * formatDate(date, "relative")       // "Today at 10:35 AM"
 * formatDate(date, "relative-short") // "Today 10:35 AM"
 * formatDate(date, "short")          // "Jun 16, 2026"
 * formatDate(date, "medium")         // "Jun 16, 2026 10:35 AM"
 * formatDate(date, "long")           // "June 16, 2026 10:35 AM"
 * formatDate(date, "full")           // "Tuesday, June 16, 2026 at 10:35 AM"
 * formatDate(date, "time-only")      // "10:35 AM"
 * formatDate(date, "date-only")      // "Jun 16, 2026"
 * formatDate(date, "iso")            // "2026-06-16T10:35:00+00:00"
 *
 * // Input: new Date("2026-06-15T10:35:00Z") (yesterday)
 * formatDate(date, "relative")       // "Yesterday at 10:35 AM"
 * formatDate(date, "relative-short") // "Yesterday 10:35 AM"
 *
 * // Input: new Date("2026-06-10T10:35:00Z") (this week)
 * formatDate(date, "relative-short") // "Wed 10:35 AM"
 *
 * // Input: new Date("2026-01-15T10:35:00Z") (this year)
 * formatDate(date, "relative")       // "Jan 15 at 10:35 AM"
 * formatDate(date, "relative-short") // "Jan 15"
 *
 * // Input: new Date("2025-06-16T10:35:00Z") (last year)
 * formatDate(date, "relative")       // "Jun 16, 2025 at 10:35 AM"
 * formatDate(date, "relative-short") // "Jun 16, 2025"
 * ```
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  variant: DateFormatVariant = "medium",
): string {
  const d = parseDate(date)
  if (!d) return "-"

  if (variant === "relative") {
    if (isToday(d)) return `Today at ${format(d, "h:mm a")}`
    if (isYesterday(d)) return `Yesterday at ${format(d, "h:mm a")}`
    if (isThisYear(d)) return format(d, "MMM d 'at' h:mm a")
    return format(d, "MMM d, yyyy 'at' h:mm a")
  }

  if (variant === "relative-short") {
    if (isToday(d)) return `Today ${format(d, "h:mm a")}`
    if (isYesterday(d)) return `Yesterday ${format(d, "h:mm a")}`
    const diff = differenceInDays(new Date(), d)
    if (diff < 7) return format(d, "EEE h:mm a")
    if (isThisYear(d)) return format(d, "MMM d")
    return format(d, "MMM d, yyyy")
  }

  return format(d, VARIANT_FORMATS[variant])
}

/**
 * Formats a date as a relative string (e.g., "Today at 10:35 AM", "Yesterday at 10:35 AM").
 *
 * @param date - The date to format
 * @returns Relative formatted date string
 *
 * @example
 * ```ts
 * formatRelativeDate(new Date())                    // "Today at 10:35 AM"
 * formatRelativeDate("2026-06-15T10:35:00Z")       // "Yesterday at 10:35 AM"
 * formatRelativeDate("2026-06-10T10:35:00Z")       // "Jun 10 at 10:35 AM"
 * formatRelativeDate("2025-06-16T10:35:00Z")       // "Jun 16, 2025 at 10:35 AM"
 * formatRelativeDate(null)                          // "-"
 * ```
 */
export function formatRelativeDate(
  date: Date | string | number | null | undefined,
): string {
  return formatDate(date, "relative")
}

/**
 * Formats a date as a short relative string (e.g., "Today 10:35 AM", "Wed 10:35 AM").
 *
 * @param date - The date to format
 * @returns Short relative formatted date string
 *
 * @example
 * ```ts
 * formatRelativeDateShort(new Date())                    // "Today 10:35 AM"
 * formatRelativeDateShort("2026-06-15T10:35:00Z")       // "Yesterday 10:35 AM"
 * formatRelativeDateShort("2026-06-10T10:35:00Z")       // "Wed 10:35 AM"
 * formatRelativeDateShort("2026-01-15T10:35:00Z")       // "Jan 15"
 * formatRelativeDateShort("2025-06-16T10:35:00Z")       // "Jun 16, 2025"
 * formatRelativeDateShort(null)                          // "-"
 * ```
 */
export function formatRelativeDateShort(
  date: Date | string | number | null | undefined,
): string {
  return formatDate(date, "relative-short")
}

export { parseDate }
