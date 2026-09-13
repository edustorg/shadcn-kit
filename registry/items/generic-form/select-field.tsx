"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form"

type SelectFieldOption =
  | string
  | { value: string; label?: string }

type SelectFieldProps<TValues extends FieldValues> = {
  name: Path<TValues>
  label?: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  /** Classes for the field wrapper. */
  className?: string
  /** Classes for the trigger. */
  triggerClass?: string
  /** Static options: strings, `{ value, label }` objects, or a `Record<string, string>`. */
  options: ReadonlyArray<SelectFieldOption> | Record<string, string>
  /**
   * Optional "clear" item rendered at the top of the list. When selected, the
   * field value is set to `emptyValue` (default `""`) so the select can be reset.
   */
  emptyOption?: { value?: string; label?: string }
  onValueChange?: (value: string) => void
}

function normalizeOptions(
  options: SelectFieldProps<FieldValues>["options"],
): Array<{ value: string; label: string }> {
  if (Array.isArray(options)) {
    return options.map((option) => {
      if (typeof option === "string") {
        return { value: option, label: option }
      }
      return { value: option.value, label: option.label ?? option.value }
    })
  }
  return Object.entries(options).map(([value, label]) => ({
    value,
    label: (label as string) ?? value,
  }))
}

/**
 * A labeled select bound to a react-hook-form field via `Controller`.
 *
 * Renders a `Field` with a `Select`, marks the field invalid when the schema
 * fails, and shows the resolved error message via `FieldError`. Works inside a
 * `GenericForm` (or any `FormProvider`).
 *
 * `options` accepts an array of strings, an array of `{ value, label }`, or a
 * `Record<string, string>` (e.g. an enum map). Pass `emptyOption` to add a
 * "None" item that resets the value, and `placeholder` for the empty state.
 */
const SelectField = <TValues extends FieldValues>({
  name,
  label,
  placeholder = "Select...",
  description,
  required = false,
  disabled = false,
  className,
  triggerClass,
  options,
  emptyOption,
  onValueChange,
}: SelectFieldProps<TValues>) => {
  const { control } = useFormContext<TValues>()

  const items = normalizeOptions(options)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {label && (
            <FieldLabel htmlFor={name}>
              <span>{label}</span>
              {required && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
          <Select
            value={field.value ?? ""}
            disabled={disabled}
            onValueChange={(value) => {
              if (onValueChange) {
                onValueChange(value)
                return
              }
              field.onChange(value)
            }}
          >
            <SelectTrigger
              id={name}
              aria-invalid={fieldState.invalid}
              className={cn("w-full", triggerClass)}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {emptyOption && (
                <SelectItem value={emptyOption.value ?? ""}>
                  {emptyOption.label ?? "None"}
                </SelectItem>
              )}
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

SelectField.displayName = "SelectField"

export { SelectField, type SelectFieldOption, type SelectFieldProps }