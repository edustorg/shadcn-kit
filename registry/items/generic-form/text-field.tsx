"use client"

import * as React from "react"
import { FieldValues, Path, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type TextFieldProps<TValues extends FieldValues> = {
  name: Path<TValues>
  label?: string
  type?: "text" | "email" | "number" | "password"
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  inputClass?: string
}

/**
 * A single-line text input bound to a react-hook-form field.
 *
 * Renders a labeled `Field` with an `Input`, marks the field invalid when the
 * schema fails, and shows the resolved error message via `FieldError`. Works
 * inside a `GenericForm` (or any `FormProvider`).
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
}: TextFieldProps<TValues>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TValues>()

  const error = errors[name]

  return (
    <Field data-invalid={!!error} className={className}>
      {label && (
        <FieldLabel htmlFor={name}>
          <span>{label}</span>
          {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(inputClass)}
        {...register(name)}
      />
      {error && <FieldError errors={[{ message: String(error.message) }]} />}
    </Field>
  )
}

TextField.displayName = "TextField"

export { TextField, type TextFieldProps }