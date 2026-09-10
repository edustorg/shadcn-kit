"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form"

import { PhoneInput } from "./phone-input"

type PhoneFieldProps<TValues extends FieldValues> = {
  name: Path<TValues>
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  defaultCountry?: React.ComponentProps<typeof PhoneInput>["defaultCountry"]
}

/**
 * A phone number input bound to a react-hook-form field via `Controller`.
 *
 * Renders a labeled `Field` with a `PhoneInput`, marks the field invalid when
 * the schema fails, and shows the resolved error message via `FieldError`.
 * Works inside a `GenericForm` (or any `FormProvider`).
 *
 * The value is stored as an E.164 string (e.g. `+628123456789`), or an empty
 * string when the input is blank. Validate with a schema such as
 * `z.string().regex(/^\+?[1-9]\d{6,14}$/, "Invalid phone number")`.
 */
const PhoneField = <TValues extends FieldValues>({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
  defaultCountry = "BD",
}: PhoneFieldProps<TValues>) => {
  const { control } = useFormContext<TValues>()

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
          <PhoneInput
            id={name}
            name={field.name}
            value={(field.value as string) || ""}
            onChange={(value) => field.onChange(value ?? "")}
            disabled={disabled}
            placeholder={placeholder}
            defaultCountry={defaultCountry}
            onBlur={field.onBlur}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

PhoneField.displayName = "PhoneField"

export { PhoneField, type PhoneFieldProps }