// AUTO-GENERATED. Run `pnpm generate` after adding or editing registry items.
import type { RegistryItem } from "../types";

export const registryItems: RegistryItem[] = [
  {
    "name": "date-picker",
    "type": "registry:ui",
    "title": "Date Picker",
    "description": "A calendar date picker built on react-hook-form. Returns the selected date as an ISO string and renders the month and year as dropdowns by default.",
    "dependencies": [
      "date-fns",
      "react-hook-form"
    ],
    "registryDependencies": [
      "utils",
      "button",
      "calendar",
      "popover",
      "field"
    ],
    "target": "@ui/edust-kit/date-picker.tsx",
    "sourcePath": "registry/items/date-picker/date-picker.tsx",
    "hasPreview": true,
    "usage": "Wrap the date picker in a react-hook-form `Controller` to bind it to a form field. The picker writes a UTC ISO string (e.g. `\"2026-08-13T00:00:00.000Z\"`) via `field.onChange`.\n\n```tsx\nimport { Controller, useForm } from \"react-hook-form\"\nimport { DatePicker } from \"@/components/ui/edust-kit/date-picker\"\n\ntype FormValues = {\n  startDate: string\n}\n\nexport function EventForm() {\n  const form = useForm<FormValues>()\n\n  return (\n    <Controller\n      name=\"startDate\"\n      control={form.control}\n      render={({ field, fieldState }) => (\n        <DatePicker\n          field={field}\n          fieldState={fieldState}\n          label=\"Start date\"\n          required\n        />\n      )}\n    />\n  )\n}\n```\n\n`captionLayout` defaults to `\"dropdown\"` — pass `\"label\"` or `\"popup\"` to switch:\n\n```tsx\n<DatePicker\n  field={field}\n  fieldState={fieldState}\n  label=\"Start date\"\n  captionLayout=\"label\"\n/>\n```"
  }
];
