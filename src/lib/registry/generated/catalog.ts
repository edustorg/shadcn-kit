// AUTO-GENERATED. Run `pnpm generate` after adding or editing registry items.
import type { RegistryItem } from "../types";

export const registryItems: RegistryItem[] = [
  {
    "name": "async-select-field",
    "type": "registry:ui",
    "title": "Async Select Field",
    "description": "A searchable async select field built on Popover and Command (cmdk). Fetches options from an API with debounced search, loading/error states, and support for pre-fetching the selected item's display value.",
    "dependencies": [],
    "registryDependencies": [
      "utils",
      "button",
      "command",
      "popover"
    ],
    "target": "@ui/edust-kit/async-select-field.tsx",
    "sourcePath": "registry/items/async-select-field/async-select-field.tsx",
    "files": [
      {
        "path": "registry/items/async-select-field/async-select-field.tsx",
        "type": "registry:ui",
        "target": "@ui/edust-kit/async-select-field.tsx"
      }
    ],
    "hasPreview": true,
    "usage": "A generic async select field for single-value selection from remotely fetched data. Ideal for dropdowns backed by API endpoints with search support.\n\n## Usage\n\n```tsx\nimport { AsyncSelectField } from \"@/components/edust-kit/async-select-field\"\n\n<AsyncSelectField\n  value={selectedId}\n  onChange={setSelectedId}\n  useDataHook={useItemsHook}\n  getItemDisplayValue={(item) => item.name}\n  placeholder=\"Select an item...\"\n/>\n```\n\n## Props\n\n`AsyncSelectField` is generic over `<T, TParams>` where `T` is the item type and `TParams` is the params type passed to `useDataHook`.\n\n| Prop | Type | Default | Description |\n|------|------|---------|-------------|\n| `value` | `string` | — | Currently selected item ID. |\n| `onChange` | `(id: string) => void` | — | Called when the user selects an item. |\n| `placeholder` | `string` | `\"Select...\"` | Text shown when no item is selected. |\n| `className` | `string` | — | Additional CSS classes for the trigger button. |\n| `debounceDelay` | `number` | `500` | Debounce delay in ms for search input. |\n| `searchPlaceholder` | `string` | `\"Search...\"` | Placeholder for the search input. |\n| `searchParamKey` | `keyof TParams` | `\"search_by_name\"` | The param key used for the search term. |\n| `useDataHook` | `(params: TParams) => { data?, isFetching, error }` | — | Hook that fetches items given params. |\n| `selectedItemData` | `{ data?: { items?: T[] } }` | — | Pre-fetched data for the selected item (used when the item is not in the current page). |\n| `getItemDisplayValue` | `(item: T) => string` | — | Returns the plain-text display label (used in trigger and as fallback). |\n| `renderItemLabel` | `(item: T) => React.ReactNode` | — | Custom render for dropdown option content. Overrides `getItemDisplayValue` in the list. |\n| `getItemKey` | `(item: T) => string` | `item.id` | Returns a unique key for React rendering. |\n| `getItemValue` | `(item: T) => string` | `item.id` | Returns the value (ID) of an item. |\n| `additionalParams` | `Partial<Omit<TParams, keyof BaseSelectParams>>` | `{}` | Extra params merged into every request. |\n| `disabled` | `boolean` | `false` | Disables the select field. |\n\n## With react-hook-form\n\n```tsx\nimport { Controller, useForm } from \"react-hook-form\"\nimport { AsyncSelectField } from \"@/components/edust-kit/async-select-field\"\n\ntype FormValues = {\n  currencyId: string\n}\n\nexport function CurrencyForm() {\n  const form = useForm<FormValues>()\n\n  return (\n    <Controller\n      name=\"currencyId\"\n      control={form.control}\n      render={({ field }) => (\n        <AsyncSelectField\n          value={field.value}\n          onChange={field.onChange}\n          useDataHook={useCurrenciesHook}\n          getItemDisplayValue={(item) => `${item.code} — ${item.name}`}\n          placeholder=\"Select currency...\"\n        />\n      )}\n    />\n  )\n}\n```\n\n## Pre-fetching selected item\n\nWhen the selected item may not be in the initial fetch (e.g. paginated results), pass `selectedItemData` so the trigger button can display the correct label:\n\n```tsx\nconst { data: selectedItemData } = useGetItem(selectedId ? { ids: [selectedId] } : undefined)\n\n<AsyncSelectField\n  value={selectedId}\n  onChange={setSelectedId}\n  useDataHook={useItemsHook}\n  selectedItemData={selectedItemData}\n  getItemDisplayValue={(item) => item.name}\n/>\n```\n\n## Custom option labels\n\nUse `renderItemLabel` to render arbitrary JSX in the dropdown (icons, multi-line, badges, etc.). The trigger always uses `getItemDisplayValue` for plain text.\n\n```tsx\n<AsyncSelectField\n  value={selectedId}\n  onChange={setSelectedId}\n  useDataHook={useItemsHook}\n  getItemDisplayValue={(item) => item.code}\n  renderItemLabel={(item) => (\n    <div className=\"flex items-center gap-2\">\n      <span className=\"font-medium\">{item.symbol}</span>\n      <span>{item.code}</span>\n      <span className=\"text-muted-foreground text-xs\">{item.name}</span>\n    </div>\n  )}\n/>\n```\n\n## Custom styling\n\nPass `className` to customize the trigger button (height, width, font size, etc.):\n\n```tsx\n<AsyncSelectField\n  className=\"h-7 text-[0.8rem] max-w-xs\"\n  value={selectedId}\n  onChange={setSelectedId}\n  useDataHook={useItemsHook}\n  getItemDisplayValue={(item) => item.name}\n/>\n```"
  },
  {
    "name": "data-table",
    "type": "registry:ui",
    "title": "Data Table",
    "description": "A feature-rich data table with advanced filtering, sorting, pagination, and URL state management using TanStack Table and nuqs.",
    "dependencies": [
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@tanstack/react-table",
      "nuqs",
      "zod"
    ],
    "registryDependencies": [
      "utils",
      "button",
      "badge",
      "input",
      "textarea",
      "select",
      "dialog",
      "popover",
      "command",
      "separator",
      "skeleton",
      "table",
      "sortable",
      "input-group"
    ],
    "target": "@/components/data-table/data-table.tsx",
    "sourcePath": "registry/items/data-table/data-table.tsx",
    "files": [
      {
        "path": "registry/items/data-table/data-table.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-advanced-toolbar.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-advanced-toolbar.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-column-header.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-column-header.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-date-filter.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-date-filter.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-async-faceted-filter.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-async-faceted-filter.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-faceted-filter.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-faceted-filter.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-filter-list.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-filter-list.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-filter-menu.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-filter-menu.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-pagination.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-pagination.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-range-filter.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-range-filter.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-skeleton.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-skeleton.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-slider-filter.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-slider-filter.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-sort-list.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-sort-list.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-toolbar.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-toolbar.tsx"
      },
      {
        "path": "registry/items/data-table/data-table-view-options.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/data-table-view-options.tsx"
      },
      {
        "path": "registry/items/data-table/ui/faceted.tsx",
        "type": "registry:ui",
        "target": "@/components/ui/faceted.tsx"
      },
      {
        "path": "registry/items/data-table/index.ts",
        "type": "registry:ui",
        "target": "@/components/data-table/index.ts"
      },
      {
        "path": "registry/items/data-table/entity/entity-test.tsx",
        "type": "registry:ui",
        "target": "@/components/data-table/entity/entity-test.tsx"
      },
      {
        "path": "registry/items/data-table/entity/index.ts",
        "type": "registry:ui",
        "target": "@/components/data-table/entity/index.ts"
      },
      {
        "path": "registry/items/data-table/lib/data-table.ts",
        "type": "registry:ui",
        "target": "@/lib/data-table.ts"
      },
      {
        "path": "registry/items/data-table/lib/parsers.ts",
        "type": "registry:ui",
        "target": "@/lib/parsers.ts"
      },
      {
        "path": "registry/items/data-table/lib/format.ts",
        "type": "registry:ui",
        "target": "@/lib/format.ts"
      },
      {
        "path": "registry/items/data-table/lib/id.ts",
        "type": "registry:ui",
        "target": "@/lib/id.ts"
      },
      {
        "path": "registry/items/data-table/lib/compose-refs.ts",
        "type": "registry:ui",
        "target": "@/lib/compose-refs.ts"
      },
      {
        "path": "registry/items/data-table/hooks/use-data-table.ts",
        "type": "registry:ui",
        "target": "@/hooks/use-data-table.ts"
      },
      {
        "path": "registry/items/data-table/hooks/use-callback-ref.ts",
        "type": "registry:ui",
        "target": "@/hooks/use-callback-ref.ts"
      },
      {
        "path": "registry/items/data-table/hooks/use-debounced-callback.ts",
        "type": "registry:ui",
        "target": "@/hooks/use-debounced-callback.ts"
      },
      {
        "path": "registry/items/data-table/config/data-table.ts",
        "type": "registry:ui",
        "target": "@/config/data-table.ts"
      },
      {
        "path": "registry/items/data-table/types/data-table.ts",
        "type": "registry:ui",
        "target": "@/types/data-table.ts"
      }
    ],
    "hasPreview": true,
    "usage": "A complete data table solution with advanced filtering, sorting, pagination, and\nURL state management. This is a barrel export that re-exports all data-table\nsub-components from `@/components/data-table/*`.\n\n## Usage\n\n```tsx\nimport { DataTable, DataTableToolbar } from \"@/components/data-table\";\nimport { useDataTable } from \"@/hooks/use-data-table\";\n```\n\n## Async Faceted Filter\n\nThe `DataTableAsyncFacetedFilter` component provides a faceted filter that\nfetches options asynchronously from an API. It supports debounced search,\nloading states, error handling, and displaying selected items that are not\ncurrently in the fetched results.\n\n### Props\n\n| Prop | Type | Description |\n|------|------|-------------|\n| `column` | `Column<TData, TValue>` | The TanStack Table column to filter |\n| `title` | `string` | Display label for the filter button |\n| `asyncOptions` | `AsyncColumnOptions` | Configuration for async data fetching |\n\n### AsyncColumnOptions\n\n```typescript\ninterface AsyncColumnOptions {\n  useDataHook: (params: Record<string, unknown>) => {\n    data?: { data?: { items?: unknown[] } };\n    isFetching: boolean;\n    error: unknown;\n  };\n  searchParamKey?: string;       // Default: \"search\"\n  getItemLabel: (item: unknown) => string;\n  getItemValue?: (item: unknown) => string;  // Default: item.id\n  additionalParams?: Record<string, unknown>;\n  debounceDelay?: number;        // Default: 300\n}\n```\n\n### Usage\n\n```tsx\nimport { DataTableAsyncFacetedFilter } from \"@/components/data-table\";\nimport { useQuery } from \"@tanstack/react-query\";\n\nfunction useUsers(params: Record<string, unknown>) {\n  return useQuery({\n    queryKey: [\"users\", params],\n    queryFn: () => fetchUsers(params),\n  });\n}\n\n<DataTableAsyncFacetedFilter\n  column={table.getColumn(\"userId\")}\n  title=\"User\"\n  asyncOptions={{\n    useDataHook: useUsers,\n    getItemLabel: (item) => item.name,\n    getItemValue: (item) => item.id,\n    searchParamKey: \"search\",\n    debounceDelay: 300,\n  }}\n/>\n```\n\n## Entity\n\nThe `entity` subdirectory includes an `EntityTest` component that renders\n\"Hello Entity Text\"."
  },
  {
    "name": "date-picker",
    "type": "registry:ui",
    "title": "Date Picker",
    "description": "A calendar date picker built on react-hook-form. Writes a UTC ISO string via field.onChange, combining the selected calendar day with the current time at the moment of selection (e.g. \"2026-08-13T14:32:05.123Z\"). Supports min/max dates, disabled days, custom placeholder, locale and display format.",
    "dependencies": [
      "date-fns",
      "react-hook-form"
    ],
    "registryDependencies": [
      "utils",
      "button",
      "calendar",
      "popover",
      "field",
      "input"
    ],
    "target": "@ui/edust-kit/date-picker.tsx",
    "sourcePath": "registry/items/date-picker/date-picker.tsx",
    "files": [
      {
        "path": "registry/items/date-picker/date-picker.tsx",
        "type": "registry:ui",
        "target": "@ui/edust-kit/date-picker.tsx"
      }
    ],
    "hasPreview": true,
    "usage": "Wrap the date picker in a react-hook-form `Controller` to bind it to a form field. The picker writes a UTC ISO string via `field.onChange`.\n\n## Typing dates\n\nThe type-to-enter UX is opt-in via the `variant` prop. The default `\"button\"`\nkeeps the original label-style trigger that opens the calendar; pass\n`variant=\"input\"` to render a field where users can type a date directly\ninstead of clicking the calendar. Both variants open the same calendar popover.\n\nAccepted typed formats (day/month/year, with or without leading zeros and\noptional separators):\n\n- `1482026` → 14 Aug 2026 (DDMMYYYY, unpadded month)\n- `14082026` → 14 Aug 2026 (DDMMYYYY)\n- `14/08/2026`, `14-8-2026` → 14 Aug 2026\n- `2026-08-14` → 14 Aug 2026 (YYYY-MM-DD)\n- `140825` → 14 Aug 2025 (DDMMYY)\n\nThe value is committed as soon as the input forms a valid date; invalid or\npartial input is ignored until complete.\n\n```tsx\n<DatePicker\n  field={field}\n  fieldState={fieldState}\n  label=\"Start date\"\n  variant=\"input\"\n/>\n```\n\n## Value shape\n\nThe stored value is always a full ISO 8601 UTC timestamp: the selected calendar\nday with the **current local time of day** stamped on it, serialized in UTC.\n\n**Format:** `YYYY-MM-DDTHH:mm:ss.sssZ`\n\n```text\n2026-08-14T07:23:41.123Z\n└──┬───┘ └─┬─┘ └─┬─┘ └┬┘ └┬┘\n  date   month  time  ms  Z = UTC\n```\n\n```json\n{\n  \"startDate\": \"2026-08-14T07:23:41.123Z\"\n}\n```\n\n- The **date** is the day the user picked in the calendar or typed.\n- The **time** is the current local time at the moment of selection (not\n  midnight), so two picks on the same day still differ by their time.\n- It is always `...Z` (UTC), regardless of the viewer's timezone.\n\nIf you only need the date and not the time, strip it after parsing, or use a\n`z` transform in your schema (see below).\n\n## Validation (Zod)\n\nValidate the field with `z.iso.datetime` (Zod v4). Use `.optional()` when the\nfield is not required, and `.refine()` to enforce a minimum date.\n\n```tsx\nimport { z } from \"zod\"\n\nconst formSchema = z.object({\n  startDate: z\n    .iso.datetime(\"Please select a valid date\")\n    .refine((value) => new Date(value) >= new Date(\"2026-01-01\"), {\n      message: \"Date must be in 2026 or later\",\n    }),\n  endDate: z.iso.datetime().optional(),\n})\n```\n\nTo read it back as a `Date` (e.g. for an API or another component):\n\n```ts\nconst date: Date = new Date(form.getValues(\"startDate\"))\n// → Date object for 2026-08-14T07:23:41.123Z\n```\n\n## Basic usage\n\n```tsx\nimport { Controller, useForm } from \"react-hook-form\"\nimport { DatePicker } from \"@/components/ui/edust-kit/date-picker\"\n\ntype FormValues = {\n  startDate: string\n}\n\nexport function EventForm() {\n  const form = useForm<FormValues>()\n\n  return (\n    <Controller\n      name=\"startDate\"\n      control={form.control}\n      render={({ field, fieldState }) => (\n        <DatePicker\n          field={field}\n          fieldState={fieldState}\n          label=\"Start date\"\n          required\n        />\n      )}\n    />\n  )\n}\n```\n\n## Default value\n\nThe field expects a UTC ISO string, so seed it with `new Date().toISOString()`\nto preselect the current date and time:\n\n```tsx\nconst form = useForm<FormValues>({\n  defaultValues: {\n    startDate: new Date().toISOString(), // e.g. \"2026-08-14T07:23:41.123Z\"\n  },\n})\n```\n\nAny value parseable by `Date` (or a `Date` object) also works, since the picker\naccepts both string and `Date` values.\n\n## Constrained usage (min/max, disabled days, placeholder)\n\n`startMonth` / `endMonth` bound the navigable range, `disabledDates` disables\nspecific days, and `placeholder` overrides the empty text.\n\n```tsx\nimport { Controller, useForm } from \"react-hook-form\"\nimport { DatePicker } from \"@/components/ui/edust-kit/date-picker\"\n\nexport function BookingForm() {\n  const form = useForm<{ startDate: string }>()\n\n  return (\n    <Controller\n      name=\"startDate\"\n      control={form.control}\n      render={({ field, fieldState }) => (\n        <DatePicker\n          field={field}\n          fieldState={fieldState}\n          label=\"Booking date\"\n          required\n          placeholder=\"Choose a booking date\"\n          startMonth={new Date(2026, 0, 1)}\n          endMonth={new Date(2026, 11, 31)}\n          disabledDates={(date) => date.getDay() === 0}\n        />\n      )}\n    />\n  )\n}\n```\n\n## Props\n\n`DatePicker` is generic over your form values and field name\n(`<TFieldValues, TName>`). Beyond the `field` / `fieldState` from a\n`Controller`, it accepts:\n\n| Prop            | Type                                              | Default       | Description                                          |\n| --------------- | ------------------------------------------------- | ------------- | ---------------------------------------------------- |\n| `label`         | `string`                                          | —             | Field label (required).                              |\n| `variant`       | `\"button\" \\| \"input\"`                             | `\"button\"`    | `\"button\"` = label trigger; `\"input\"` = type-to-enter field. |\n| `required`      | `boolean`                                         | `true`        | Shows a required marker and marks the trigger.       |\n| `disabled`      | `boolean`                                         | `false`       | Disables the whole control.                          |\n| `placeholder`   | `string`                                          | `\"Pick a date\"` | Empty-state text on the trigger.                   |\n| `startMonth`    | `Date`                                            | —             | Earliest selectable month (inclusive). Also bounds the dropdown range. |\n| `endMonth`      | `Date`                                            | —             | Latest selectable month (inclusive). Also bounds the dropdown range. |\n| `disabledDates` | `Matcher \\| Matcher[]` (react-day-picker)         | —             | Disables specific days.                              |\n| `captionLayout` | `\"label\" \\| \"dropdown\" \\| \"dropdown-months\" \\| \"dropdown-years\"` | `\"dropdown\"` | Calendar caption layout.                |\n| `locale`        | `Locale` (date-fns)                               | —             | Locale for formatting and the calendar.              |\n| `displayFormat` | `string`                                          | `\"PPP\"`       | date-fns format string for the trigger label.        |\n\n`captionLayout` defaults to `\"dropdown\"` — pass `\"label\"` to switch to a\nsimple label:\n\n```tsx\n<DatePicker\n  field={field}\n  fieldState={fieldState}\n  label=\"Start date\"\n  captionLayout=\"label\"\n/>\n```\n\n## Dropdown navigation range\n\nWith `captionLayout=\"dropdown\"`, the year/month dropdowns only span the range\nset by `startMonth` / `endMonth`. If you omit them, the year dropdown defaults\nto **[current year − 100, current year]** — so future years like 2030 will not\nappear unless you extend `endMonth`. `startMonth` / `endMonth` also disable\ndates outside that range.\n\n```tsx\n<DatePicker\n  field={field}\n  fieldState={fieldState}\n  label=\"Event date\"\n  variant=\"input\"\n  captionLayout=\"dropdown\"\n  startMonth={new Date(2020, 0, 1)}\n  endMonth={new Date(2030, 11, 31)}\n/>\n```"
  }
];
