// AUTO-GENERATED. Run `pnpm generate` after adding or editing registry items.
import type { RegistryItem } from "../types";

export const registryItems: RegistryItem[] = [
  {
    "name": "badge",
    "type": "registry:ui",
    "title": "Badge",
    "description": "A badge component with shadcn variants plus custom success, warning, and info variants.",
    "dependencies": [
      "class-variance-authority",
      "@base-ui/react"
    ],
    "registryDependencies": [
      "utils"
    ],
    "cssVars": {
      "light": {
        "success": "oklch(0.723 0.187 150.5)",
        "warning": "oklch(0.769 0.188 70.08)",
        "info": "oklch(0.588 0.226 264.4)"
      },
      "dark": {
        "success": "oklch(0.775 0.196 156.7)",
        "warning": "oklch(0.833 0.194 84.6)",
        "info": "oklch(0.716 0.199 252.4)"
      }
    },
    "target": "@ui/edust-kit/badge.tsx",
    "sourcePath": "registry/items/badge/badge.tsx",
    "hasPreview": true,
    "usage": "Use the Badge to label or categorize content. It ships with the shadcn variants plus custom\n`success`, `warning`, and `info` variants.\n\n```tsx\nimport { Badge } from \"@/components/ui/edust-kit/badge\";\n\n<Badge>Default</Badge>\n<Badge variant=\"success\">Active</Badge>\n<Badge variant=\"warning\">Pending</Badge>\n<Badge variant=\"info\">New</Badge>\n```"
  },
  {
    "name": "button",
    "type": "registry:ui",
    "title": "Button",
    "description": "A button component with variants, sizes, and icons.",
    "dependencies": [
      "class-variance-authority",
      "@base-ui/react"
    ],
    "registryDependencies": [
      "utils"
    ],
    "target": "@ui/edust-kit/button.tsx",
    "sourcePath": "registry/items/button/button.tsx",
    "hasPreview": true,
    "usage": "Use the Button anywhere you need a clickable action element.\n\n```tsx\nimport { Button } from \"@/components/ui/edust-kit/button\";\n\n<Button>Default</Button>\n<Button variant=\"destructive\">Delete</Button>\n<Button size=\"sm\">Small</Button>\n```"
  },
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
