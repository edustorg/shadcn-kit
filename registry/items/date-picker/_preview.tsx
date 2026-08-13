"use client"

import { Controller, useForm } from "react-hook-form"

import { DatePicker } from "./date-picker"

export function Preview() {
  const form = useForm<{ startDate: string }>({
    defaultValues: { startDate: "" },
  })

  return (
    <div className="flex w-full justify-center py-4">
      <Controller
        name="startDate"
        control={form.control}
        render={({ field, fieldState }) => (
          <DatePicker field={field} fieldState={fieldState} label="Start date" />
        )}
      />
    </div>
  )
}
