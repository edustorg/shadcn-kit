"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form"

type TextAreaFieldProps<TValues extends FieldValues> = {
  name: Path<TValues>
  label?: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  /** Classes for the field wrapper. */
  className?: string
  /** Classes for the textarea. */
  textAreaClass?: string
  rows?: number
  autoComplete?: string
}

/**
 * A multi-line text area bound to a react-hook-form field via `Controller`.
 *
 * Renders a labeled `Field` with a `Textarea`, marks the field invalid when the
 * schema fails, and shows the resolved error message via `FieldError`. Works
 * inside a `GenericForm` (or any `FormProvider`).
 */
const TextAreaField = <TValues extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  className,
  textAreaClass,
  rows,
  autoComplete,
}: TextAreaFieldProps<TValues>) => {
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
          <Textarea
            ref={field.ref}
            id={name}
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            autoComplete={autoComplete}
            className={cn(textAreaClass)}
          />
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

TextAreaField.displayName = "TextAreaField"

export { TextAreaField, type TextAreaFieldProps }
