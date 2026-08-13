"use client"

import { useState } from "react"
import { format, isValid, parseISO } from "date-fns"
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>
  fieldState: ControllerFieldState
  label: string
  required?: boolean
  captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"]
}

export const DatePicker = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldState,
  label,
  required = true,
  captionLayout = "dropdown",
}: DatePickerProps<TFieldValues, TName>) => {
  const [open, setOpen] = useState(false)

  const parseDate = (value?: string) => {
    if (!value) return undefined
    const d = parseISO(value)
    return isValid(d) ? d : undefined
  }

  const toUTCMidnight = (date: Date) =>
    new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString()

  const display = (value?: string) => {
    const d = parseDate(value)
    return d ? format(d, "PPP") : "Pick a date"
  }

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-70 justify-start text-left font-normal"
          >
            {display(field.value)}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout={captionLayout}
            selected={parseDate(field.value)}
            defaultMonth={parseDate(field.value)}
            onSelect={(date) => {
              field.onChange(date ? toUTCMidnight(date) : undefined)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
