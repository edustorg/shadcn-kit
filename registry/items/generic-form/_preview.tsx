"use client"

import { z } from "zod"

import * as React from "react"

import { GenericForm, type GenericFormRef } from "./"
import { AsyncMultiSelectField } from "./async-multi-select-field"
import { AsyncSelectField } from "./async-select-field"
import type { SelectFieldItem } from "./async-select-field"
import { TextField } from "./text-field"

const previewSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Max 50 characters"),
  email: z.email("Enter a valid email address"),
})

type PreviewValues = z.infer<typeof previewSchema>

type MockSubmitResult = { ok: boolean; message?: string }

interface MockItem extends SelectFieldItem {
  code: string
  symbol: string
}

const MOCK_CURRENCIES: MockItem[] = [
  { id: "1", code: "USD", symbol: "$", name: "US Dollar" },
  { id: "2", code: "EUR", symbol: "€", name: "Euro" },
  { id: "3", code: "GBP", symbol: "£", name: "British Pound" },
  { id: "4", code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { id: "5", code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { id: "6", code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { id: "7", code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { id: "8", code: "CAD", symbol: "C$", name: "Canadian Dollar" },
]

function useMockDataHook(params: Record<string, unknown>) {
  const search = (params.search_by_name as string) ?? ""
  const [data, setData] = React.useState<{ data: { items: MockItem[] } }>({
    data: { items: [] },
  })
  const [isFetching, setIsFetching] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      const filtered = search
        ? MOCK_CURRENCIES.filter(
            (item) =>
              item.name?.toLowerCase().includes(search.toLowerCase()) ||
              item.code.toLowerCase().includes(search.toLowerCase()),
          )
        : MOCK_CURRENCIES
      if (!cancelled) {
        setData({ data: { items: filtered } })
        setIsFetching(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [search])

  return { data, isFetching, error: null }
}

interface MockLabel {
  id: string
  name: string
  color: string
}

const MOCK_LABELS: MockLabel[] = [
  { id: "1", name: "Bug", color: "red" },
  { id: "2", name: "Feature", color: "blue" },
  { id: "3", name: "Docs", color: "green" },
  { id: "4", name: "Design", color: "purple" },
  { id: "5", name: "Backend", color: "orange" },
  { id: "6", name: "Frontend", color: "cyan" },
  { id: "7", name: "Testing", color: "pink" },
  { id: "8", name: "Chore", color: "gray" },
]

function useMockLabelsHook(params: Record<string, unknown>) {
  const search = (params.search_by_name as string) ?? ""
  const [data, setData] = React.useState<{ data: { items: MockLabel[] } }>({
    data: { items: [] },
  })
  const [isFetching, setIsFetching] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      const filtered = search
        ? MOCK_LABELS.filter((label) =>
            label.name.toLowerCase().includes(search.toLowerCase()),
          )
        : MOCK_LABELS
      if (!cancelled) {
        setData({ data: { items: filtered } })
        setIsFetching(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [search])

  return { data, isFetching, error: null }
}

function mockSubmit(values: PreviewValues): Promise<MockSubmitResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ok: true, message: JSON.stringify(values) })
    }, 800)
  })
}

export function Preview() {
  const formRef = React.useRef<GenericFormRef<PreviewValues>>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [result, setResult] = React.useState<MockSubmitResult | null>(null)
  const [labels, setLabels] = React.useState<string[]>([])
  const [labelsMax, setLabelsMax] = React.useState<string[]>([])
  const [currency, setCurrency] = React.useState("")
  const [currency2, setCurrency2] = React.useState("")
  const [currency3, setCurrency3] = React.useState("")
  const [currency4, setCurrency4] = React.useState("")

  const handleSubmit = async (values: PreviewValues) => {
    setIsSubmitting(true)
    setResult(null)
    const res = await mockSubmit(values)
    setIsSubmitting(false)
    setResult(res)
  }

  return (
    <>
      <div className="flex w-full max-w-sm flex-col gap-6 py-4">
        <GenericForm
          ref={formRef}
          schema={previewSchema}
          initialValues={{ name: "", email: "" }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <TextField name="name" label="Name" required placeholder="John Doe" />
          <TextField
            name="email"
            label="Email"
            type="email"
            placeholder="john@example.com"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/80 h-8 rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => formRef.current?.reset({ name: "", email: "" })}
              className="bg-background hover:bg-muted h-8 rounded-lg border px-3 text-sm font-medium"
            >
              Reset
            </button>
          </div>
        </GenericForm>

        <div className="text-muted-foreground border-t pt-3 text-sm">
          {result?.ok
            ? `Sent: ${result.message}`
            : isSubmitting
              ? "Sending..."
              : "Submit the form to see validated values here."}
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6 py-4">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">
            Async multi-select badges
          </span>
          <AsyncMultiSelectField
            value={labels}
            onChange={setLabels}
            placeholder="Select labels..."
            searchPlaceholder="Search labels..."
            searchParamKey="search_by_name"
            useDataHook={useMockLabelsHook}
            getItemDisplayValue={(item) => item.name}
          />
          <code className="text-muted-foreground text-sm">
            Selected: {labels.length ? labels.join(", ") : "None"}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">
            Max 3 selections
          </span>
          <AsyncMultiSelectField
            value={labelsMax}
            onChange={setLabelsMax}
            placeholder="Pick up to 3 labels..."
            searchPlaceholder="Search labels..."
            searchParamKey="search_by_name"
            useDataHook={useMockLabelsHook}
            getItemDisplayValue={(item) => item.name}
            maxSelected={3}
          />
          <code className="text-muted-foreground text-sm">
            Selected: {labelsMax.length ? labelsMax.join(", ") : "None"}
          </code>
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6 py-4">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">Default size</span>
          <AsyncSelectField
            value={currency}
            onChange={setCurrency}
            placeholder="Select a currency..."
            searchPlaceholder="Search currencies..."
            searchParamKey="search_by_name"
            useDataHook={useMockDataHook}
            getItemDisplayValue={(item) =>
              item.name && item.code
                ? `${item.symbol} ${item.code} — ${item.name}`
                : item.name || ""
            }
          />
          <code className="text-muted-foreground text-sm">
            Selected: {currency || "None"}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">
            Custom className + custom label
          </span>
          <AsyncSelectField
            value={currency2}
            onChange={setCurrency2}
            placeholder="Pick currency..."
            searchPlaceholder="Search..."
            searchParamKey="search_by_name"
            useDataHook={useMockDataHook}
            className="h-7 text-[0.8rem]"
            getItemDisplayValue={(item) => item.code ?? ""}
            renderItemLabel={(item) => (
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.symbol}</span>
                <span>{item.code}</span>
                <span className="text-muted-foreground text-xs">
                  {item.name}
                </span>
              </div>
            )}
          />
          <code className="text-muted-foreground text-sm">
            Selected: {currency2 || "None"}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">
            Icon-only trigger (30px)
          </span>
          <AsyncSelectField
            value={currency3}
            onChange={setCurrency3}
            placeholder="$"
            searchPlaceholder="Search currencies..."
            searchParamKey="search_by_name"
            useDataHook={useMockDataHook}
            className="w-[30px] justify-center px-0"
            getItemDisplayValue={(item) => item.symbol ?? ""}
            renderItemLabel={(item) => (
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">{item.symbol}</span>
                <span>{item.code}</span>
                <span className="text-muted-foreground text-xs">
                  {item.name}
                </span>
              </div>
            )}
          />
          <code className="text-muted-foreground text-sm">
            Selected: {currency3 || "None"}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">
            Lazy (fetch only on open)
          </span>
          <AsyncSelectField
            lazy
            value={currency4}
            onChange={setCurrency4}
            placeholder="Select a currency..."
            searchPlaceholder="Search currencies..."
            searchParamKey="search_by_name"
            useDataHook={useMockDataHook}
            getItemDisplayValue={(item) =>
              item.name && item.code
                ? `${item.symbol} ${item.code} — ${item.name}`
                : item.name || ""
            }
          />
          <code className="text-muted-foreground text-sm">
            Selected: {currency4 || "None"}
          </code>
        </div>
      </div>
    </>
  )
}
