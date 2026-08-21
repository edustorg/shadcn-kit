"use client"

import * as React from "react"
import { format, isValid, parseISO } from "date-fns"
import type { Locale } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerVariant = "button" | "input"

type DatePickerProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>
  fieldState: ControllerFieldState
  label: string
  /** Visual style. `"button"` shows a label that opens the calendar (default);
   *  `"input"` adds a type-to-enter field that also accepts the calendar. */
  variant?: DatePickerVariant
  /** Show a required marker and mark the trigger as required. */
  required?: boolean
  /** Disable the whole control. */
  disabled?: boolean
  /** Empty-state text shown on the trigger. */
  placeholder?: string
  /** Earliest selectable date (inclusive). */
  startMonth?: Date
  /** Latest selectable date (inclusive). */
  endMonth?: Date
  /** Matchers forwarded to the calendar to disable specific days. */
  disabledDates?: React.ComponentProps<typeof Calendar>["disabled"]
  captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"]
  /** Locale used for formatting and the calendar. */
  locale?: Locale
  /** date-fns format string for the trigger label. */
  displayFormat?: string
}

// Tolerant parser for typed input: DDMMYYYY (with or without leading zeros and
// optional separators), also accepting DDMMYY and YYYY-MM-DD.
function parseTypedDate(raw: string): Date | undefined {
  if (!raw) return undefined

  if (/[/\-.]/.test(raw)) {
    const parts = raw.split(/[/\-.,\s]+/).filter(Boolean)
    if (parts.length !== 3) return undefined
    const p0 = parts[0]
    const p1 = parts[1]
    const p2 = parts[2]
    if (!p0 || !p1 || !p2) return undefined
    let day: number, month: number, year: number
    if (p0.length === 4) {
      year = Number(p0)
      month = Number(p1)
      day = Number(p2)
    } else {
      day = Number(p0)
      month = Number(p1)
      year = Number(p2)
      if (year < 100) year += 2000
    }
    return buildDate(day, month, year)
  }

  const digits = raw.replace(/\D/g, "")
  if (digits.length < 6) return undefined

  let day: number, month: number, year: number
  if (digits.length === 6) {
    day = Number(digits.slice(0, 2))
    month = Number(digits.slice(2, 4))
    year = Number(digits.slice(4)) + 2000
  } else {
    year = Number(digits.slice(-4))
    const prefix = digits.slice(0, -4)
    if (prefix.length === 4) {
      day = Number(prefix.slice(0, 2))
      month = Number(prefix.slice(2))
    } else if (prefix.length === 3) {
      if (Number(prefix.slice(2)) >= 1 && Number(prefix.slice(2)) <= 12) {
        day = Number(prefix.slice(0, 2))
        month = Number(prefix.slice(2))
      } else if (Number(prefix.slice(1)) >= 1 && Number(prefix.slice(1)) <= 12) {
        day = Number(prefix.slice(0, 1))
        month = Number(prefix.slice(1))
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  }
  return buildDate(day, month, year)
}

function buildDate(day: number, month: number, year: number): Date | undefined {
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }
  return date
}

export const DatePicker = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldState,
  label,
  variant = "button",
  required = true,
  disabled = false,
  placeholder = "Pick a date",
  startMonth,
  endMonth,
  disabledDates,
  captionLayout = "dropdown",
  locale,
  displayFormat = "PPP",
}: DatePickerProps<TFieldValues, TName>) => {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const id = React.useId()

  const localeOptions = locale ? { locale } : undefined

  const parseDate = React.useCallback((value: unknown): Date | undefined => {
    if (!value) return undefined
    const date = value instanceof Date ? value : parseISO(String(value))
    return isValid(date) ? date : undefined
  }, [])

  // Keep the picked day but stamp it with the current local time of day so the
  // stored value is always a full timestamp rather than midnight.
  const toValue = (date: Date) => {
    const now = new Date()
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    ).toISOString()
  }

  const selected = parseDate(field.value)
  const invalid = Boolean(fieldState.error)
  const formattedValue = selected
    ? format(selected, displayFormat, localeOptions)
    : placeholder

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    setDraft(next)
    const parsed = parseTypedDate(next)
    if (parsed) field.onChange(toValue(parsed))
  }

  const handleInputFocus = () => {
    setEditing(true)
    setDraft(selected ? format(selected, "ddMMyyyy", localeOptions) : "")
  }

  const handleInputBlur = () => {
    setEditing(false)
    setDraft("")
    if (draft.trim() === "") {
      field.onChange(undefined)
      return
    }
    // Incomplete/invalid input: revert to the stored value.
    if (!parseTypedDate(draft)) {
      field.onChange(selected ? field.value : undefined)
    }
  }

  const calendar = (
    <Calendar
      mode="single"
      captionLayout={captionLayout}
      locale={locale}
      startMonth={startMonth}
      endMonth={endMonth}
      disabled={disabledDates}
      selected={selected}
      defaultMonth={selected ?? startMonth ?? new Date()}
      onSelect={(date) => {
        field.onChange(date ? toValue(date) : undefined)
        setOpen(false)
      }}
    />
  )

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={variant === "input" ? id : undefined}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </FieldLabel>

      {variant === "input" ? (
        <Popover open={open} onOpenChange={setOpen}>
          <div className="relative w-70">
            <Input
              id={id}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              disabled={disabled}
              value={
                editing
                  ? draft
                  : selected
                    ? format(selected, displayFormat, localeOptions)
                    : ""
              }
              placeholder={editing ? "DDMMYYYY" : placeholder}
              aria-invalid={invalid || undefined}
              aria-required={required || undefined}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="pr-10"
            />
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                aria-label={`Open calendar for ${label}`}
                className="absolute right-0.5 top-1/2 size-7 -translate-y-1/2"
              >
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
          </div>

          <PopoverContent className="w-auto p-0" align="start">
            {calendar}
          </PopoverContent>
        </Popover>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              aria-invalid={invalid || undefined}
              aria-required={required || undefined}
              aria-label={
                selected ? `${label}: ${formattedValue}` : `${label}: ${placeholder}`
              }
              className={cn(
                "w-70 justify-start text-left font-normal",
                !selected && "text-muted-foreground"
              )}
            >
              {formattedValue}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            {calendar}
          </PopoverContent>
        </Popover>
      )}

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
