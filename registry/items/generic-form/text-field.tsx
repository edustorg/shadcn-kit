"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form"

import React from "react"

type TextFieldProps<TValues extends FieldValues> = {
  name: Path<TValues>
  label?: string
  type?: "text" | "email" | "number" | "password" | "tel" | "url"
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
  inputClass?: string
  min?: number | string
  max?: number | string
  step?: number | string
  autoComplete?: string
  onValueChange?: (value: string | number | null) => void
}

/**
 * A single-line text input bound to a react-hook-form field via `Controller`.
 *
 * Renders a labeled `Field` with an `Input`, marks the field invalid when the
 * schema fails, and shows the resolved error message via `FieldError`. Works
 * inside a `GenericForm` (or any `FormProvider`).
 *
 * When `type === "number"`, the value is coerced to a number (or `null` when
 * empty) before being written to the form, matching common zod+api payloads.
 * Pass `onValueChange` for custom value coercion/transforms.
 */
const TextField = <TValues extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  className,
  inputClass,
  min,
  max,
  step,
  autoComplete,
  onValueChange,
}: TextFieldProps<TValues>) => {
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
          <Input
            ref={field.ref}
            id={name}
            name={field.name}
            type={type}
            value={field.value ?? ""}
            onChange={(e) => {
              if (onValueChange) {
                onValueChange(
                  type === "number"
                    ? e.target.value === ""
                      ? null
                      : Number(e.target.value)
                    : e.target.value,
                )
                return
              }
              if (type === "number") {
                const value =
                  e.target.value === "" ? null : Number(e.target.value)
                field.onChange(value)
                return
              }
              field.onChange(e.target.value)
            }}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            autoComplete={autoComplete}
            className={cn(inputClass)}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

TextField.displayName = "TextField"

export { TextField, type TextFieldProps }
