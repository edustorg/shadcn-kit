"use client"

import * as React from "react"

import { AsyncSelectField } from "./async-select-field"
import type { SelectFieldItem } from "./async-select-field"

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

export function Preview() {
  const [value, setValue] = React.useState("")
  const [value2, setValue2] = React.useState("")
  const [value3, setValue3] = React.useState("")

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">Default size</span>
        <AsyncSelectField
          value={value}
          onChange={setValue}
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
          Selected: {value || "None"}
        </code>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">
          Custom className + custom label
        </span>
        <AsyncSelectField
          value={value2}
          onChange={setValue2}
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
              <span className="text-muted-foreground text-xs">{item.name}</span>
            </div>
          )}
        />
        <code className="text-muted-foreground text-sm">
          Selected: {value2 || "None"}
        </code>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">
          Icon-only trigger (30px)
        </span>
        <AsyncSelectField
          value={value3}
          onChange={setValue3}
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
              <span className="text-muted-foreground text-xs">{item.name}</span>
            </div>
          )}
        />
        <code className="text-muted-foreground text-sm">
          Selected: {value3 || "None"}
        </code>
      </div>
    </div>
  )
}
