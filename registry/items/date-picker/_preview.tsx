"use client";

import { Controller, useForm } from "react-hook-form";

import { DatePicker } from "./date-picker";
import { format, isToday, isYesterday } from "date-fns";

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isToday(d)) return `Today at ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday at ${format(d, "h:mm a")}`;
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function Preview() {
  const form = useForm<{
    startDate: string
    endDate: string
    eventDate: string
  }>({
    defaultValues: { startDate: "", endDate: "", eventDate: "" },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const eventDate = form.watch("eventDate");

  return (
    <div className="flex w-full flex-col items-center gap-6 py-4">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Controller
          name="startDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <DatePicker
              field={field}
              fieldState={fieldState}
              label="Start date (button)"
              variant="button"
            />
          )}
        />
        <code className="text-muted-foreground text-sm">
          {startDate || "No date selected"}
        </code>
        <p className="text-muted-foreground text-sm">
          {startDate ? formatRelativeDate(startDate) : "No date selected"}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2">
        <Controller
          name="endDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <DatePicker
              field={field}
              fieldState={fieldState}
              label="End date (input)"
              variant="input"
            />
          )}
        />
        <code className="text-muted-foreground text-sm">
          {endDate || "No date selected"}
        </code>
        <p className="text-muted-foreground text-sm">
          {endDate ? formatRelativeDate(endDate) : "No date selected"}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2">
        <Controller
          name="eventDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <DatePicker
              field={field}
              fieldState={fieldState}
              label="Event date (dropdown to 31 Dec 2030)"
              variant="button"
              captionLayout="dropdown"
              startMonth={new Date(2020, 0, 1)}
              endMonth={new Date(2030, 11, 31)}
            />
          )}
        />
        <code className="text-muted-foreground text-sm">
          {eventDate || "No date selected"}
        </code>
        <p className="text-muted-foreground text-sm">
          {eventDate ? formatRelativeDate(eventDate) : "No date selected"}
        </p>
      </div>
    </div>
  );
}
