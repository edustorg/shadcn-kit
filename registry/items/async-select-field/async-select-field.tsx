"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { useDebouncedCallback } from "./hooks/use-debounced-callback"

export interface SelectFieldItem {
  id: string
  name?: string
  label?: string
}

export interface BaseSelectParams {
  search_by_name?: string
  page?: number
  limit?: number
  [key: string]: unknown
}

interface AsyncSelectFieldProps<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
> {
  value?: string
  onChange: (id: string) => void
  placeholder?: string
  debounceDelay?: number
  searchPlaceholder?: string
  searchParamKey?: keyof TParams
  useDataHook: (params: TParams) => {
    data?: { data?: { items?: T[] } }
    isFetching: boolean
    error: unknown
  }
  selectedItemData?: { data?: { items?: T[] } }
  getItemDisplayValue: (item: T) => string
  getItemKey?: (item: T) => string
  getItemValue?: (item: T) => string
  renderItemLabel?: (item: T) => React.ReactNode
  additionalParams?: Partial<Omit<TParams, keyof BaseSelectParams>>
  disabled?: boolean
  className?: string
  showSearchIcon?: boolean
}

export function AsyncSelectField<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
>({
  value,
  onChange,
  placeholder = "Select...",
  debounceDelay = 500,
  searchPlaceholder = "Search...",
  searchParamKey = "search_by_name" as keyof TParams,
  useDataHook,
  selectedItemData,
  getItemDisplayValue,
  getItemKey,
  getItemValue,
  renderItemLabel,
  additionalParams = {},
  disabled = false,
  className,
  showSearchIcon = false,
}: AsyncSelectFieldProps<T, TParams>) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [contentWidth, setContentWidth] = React.useState<number | undefined>()
  const debouncedSetSearch = useDebouncedCallback(
    setDebouncedSearch,
    debounceDelay,
  )

  React.useEffect(() => {
    if (!open || !triggerRef.current) return
    const el = triggerRef.current.closest(
      "[data-slot='field-control'], [data-slot='form-item'], form, [role='group']",
    ) as HTMLElement | null
    const w = el?.offsetWidth ?? triggerRef.current.parentElement?.offsetWidth
    setContentWidth(w)
  }, [open])

  const onOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSearch("")
      setDebouncedSearch("")
    }
  }, [])

  const params = React.useMemo(() => {
    return {
      [searchParamKey]: debouncedSearch || undefined,
      ...additionalParams,
    } as TParams
  }, [debouncedSearch, additionalParams, searchParamKey])

  const { data, isFetching, error } = useDataHook(params)

  const items = React.useMemo(() => data?.data?.items ?? [], [data])

  const getValue = React.useMemo(
    () => getItemValue ?? ((item: T) => item.id),
    [getItemValue],
  )

  const selectedItemFromList = React.useMemo(
    () => items.find((item) => getValue(item) === value),
    [value, items, getValue],
  )

  const selectedItem = React.useMemo(() => {
    if (selectedItemFromList) return selectedItemFromList
    const fetchedItems = selectedItemData?.data?.items ?? []
    return fetchedItems.find((item) => getValue(item) === value)
  }, [selectedItemFromList, selectedItemData, value, getValue])

  const handleSelect = React.useCallback(
    (itemValue: string) => {
      onChange(itemValue)
      setOpen(false)
    },
    [onChange],
  )

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !selectedItem && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selectedItem ? getItemDisplayValue(selectedItem) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{
          minWidth: contentWidth,
          maxWidth: "100vw",
        }}
        align="start"
      >
        <Command shouldFilter={false}>
          {showSearchIcon ? (
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={(value) => {
                setSearch(value)
                debouncedSetSearch(value)
              }}
            />
          ) : (
            <div className="px-1 pt-1">
              <Input
                data-slot="command-input"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  debouncedSetSearch(e.target.value)
                }}
                className="h-8 w-full border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
              />
            </div>
          )}
          <CommandList>
            {isFetching ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : error ? (
              <CommandEmpty>Failed to load items.</CommandEmpty>
            ) : items.length === 0 ? (
              <CommandEmpty>
                {debouncedSearch ? "No items found." : "No items available."}
              </CommandEmpty>
            ) : (
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {items.map((item) => {
                  const itemValue = getValue(item)
                  return (
                    <CommandItem
                      key={getItemKey ? getItemKey(item) : itemValue}
                      value={itemValue}
                      onSelect={handleSelect}
                    >
                      {renderItemLabel
                        ? renderItemLabel(item)
                        : getItemDisplayValue(item)}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
