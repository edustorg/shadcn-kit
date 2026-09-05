"use client"

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

import * as React from "react"

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
  /**
   * When `true`, the dropdown list is fetched only after the popover is opened
   * instead of on mount. Use this on forms with many async selects to avoid
   * firing a burst of requests at page load.
   */
  lazy?: boolean
}

const defaultGetItemValue = (item: SelectFieldItem) => item.id

interface AsyncSelectCommandProps<T extends SelectFieldItem> {
  search: string
  setSearch: (value: string) => void
  debouncedSetSearch: (value: string) => void
  searchPlaceholder: string
  showSearchIcon: boolean
  items: T[]
  isFetching: boolean
  error: unknown
  getItemKey?: (item: T) => string
  getItemValue: (item: T) => string
  getItemDisplayValue: (item: T) => string
  renderItemLabel?: (item: T) => React.ReactNode
  onSelect: (itemValue: string) => void
}

function AsyncSelectCommand<T extends SelectFieldItem>({
  search,
  setSearch,
  debouncedSetSearch,
  searchPlaceholder,
  showSearchIcon,
  items,
  isFetching,
  error,
  getItemKey,
  getItemValue,
  getItemDisplayValue,
  renderItemLabel,
  onSelect,
}: AsyncSelectCommandProps<T>) {
  return (
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
          <div className="text-muted-foreground flex items-center justify-center py-6 text-sm">
            Loading...
          </div>
        ) : error ? (
          <CommandEmpty>Failed to load items.</CommandEmpty>
        ) : items.length === 0 ? (
          <CommandEmpty>
            {search ? "No items found." : "No items available."}
          </CommandEmpty>
        ) : (
          <CommandGroup className="max-h-75 overflow-y-auto">
            {items.map((item) => {
              const itemValue = getItemValue(item)
              return (
                <CommandItem
                  key={getItemKey ? getItemKey(item) : itemValue}
                  value={itemValue}
                  onSelect={() => onSelect(itemValue)}
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
  )
}

interface UseAsyncSelectFieldStateConfig<
  TParams extends BaseSelectParams,
> {
  onChange: (id: string) => void
  debounceDelay: number
  searchParamKey: keyof TParams
  additionalParams: Partial<Omit<TParams, keyof BaseSelectParams>>
}

function useAsyncSelectFieldState<TParams extends BaseSelectParams>({
  onChange,
  debounceDelay,
  searchParamKey,
  additionalParams,
}: UseAsyncSelectFieldStateConfig<TParams>) {
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

  const handleSelect = React.useCallback(
    (itemValue: string) => {
      onChange(itemValue)
      setOpen(false)
    },
    [onChange],
  )

  return {
    open,
    search,
    setSearch,
    debouncedSetSearch,
    triggerRef,
    contentWidth,
    onOpenChange,
    params,
    handleSelect,
  }
}

interface AsyncSelectShellProps<T extends SelectFieldItem> {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  disabled: boolean
  className?: string
  selectedItem?: T
  getItemDisplayValue: (item: T) => string
  placeholder: string
  contentWidth: number | undefined
  children: React.ReactNode
}

function AsyncSelectShell<T extends SelectFieldItem>({
  open,
  onOpenChange,
  triggerRef,
  disabled,
  className,
  selectedItem,
  getItemDisplayValue,
  placeholder,
  contentWidth,
  children,
}: AsyncSelectShellProps<T>) {
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
        {children}
      </PopoverContent>
    </Popover>
  )
}

interface AsyncSelectLazyBodyProps<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
> extends Omit<AsyncSelectCommandProps<T>, "items" | "isFetching" | "error"> {
  params: TParams
  useDataHook: AsyncSelectFieldProps<T, TParams>["useDataHook"]
}

function AsyncSelectLazyBody<T extends SelectFieldItem, TParams extends BaseSelectParams>({
  params,
  useDataHook,
  ...commandProps
}: AsyncSelectLazyBodyProps<T, TParams>) {
  const { data, isFetching, error } = useDataHook(params)
  const items = React.useMemo(() => data?.data?.items ?? [], [data])

  return (
    <AsyncSelectCommand
      {...commandProps}
      items={items}
      isFetching={isFetching}
      error={error}
    />
  )
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
  lazy = false,
}: AsyncSelectFieldProps<T, TParams>) {
  const state = useAsyncSelectFieldState<TParams>({
    onChange,
    debounceDelay,
    searchParamKey,
    additionalParams,
  })

  const getValue = React.useMemo(
    () => getItemValue ?? defaultGetItemValue,
    [getItemValue],
  )

  const selectedItemDataItems = React.useMemo(
    () => selectedItemData?.data?.items ?? [],
    [selectedItemData],
  )

  const selectedItemFromData = React.useMemo(
    () => selectedItemDataItems.find((item) => getValue(item) === value),
    [selectedItemDataItems, value, getValue],
  )

  const commandProps = {
    search: state.search,
    setSearch: state.setSearch,
    debouncedSetSearch: state.debouncedSetSearch,
    searchPlaceholder,
    showSearchIcon,
    getItemKey,
    getItemValue: getValue,
    getItemDisplayValue,
    renderItemLabel,
    onSelect: state.handleSelect,
  }

  if (lazy) {
    return (
      <AsyncSelectShell
        open={state.open}
        onOpenChange={state.onOpenChange}
        triggerRef={state.triggerRef}
        disabled={disabled}
        className={className}
        selectedItem={selectedItemFromData}
        getItemDisplayValue={getItemDisplayValue}
        placeholder={placeholder}
        contentWidth={state.contentWidth}
      >
        {state.open ? (
          <AsyncSelectLazyBody
            params={state.params}
            useDataHook={useDataHook}
            {...commandProps}
          />
        ) : null}
      </AsyncSelectShell>
    )
  }

  return (
    <AsyncSelectEager
      value={value}
      useDataHook={useDataHook}
      selectedItemFromData={selectedItemFromData}
      getItemDisplayValue={getItemDisplayValue}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      state={state}
      getValue={getValue}
      commandProps={commandProps}
    />
  )
}

interface AsyncSelectEagerProps<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
> {
  value?: string
  useDataHook: AsyncSelectFieldProps<T, TParams>["useDataHook"]
  selectedItemFromData?: T
  getItemDisplayValue: (item: T) => string
  disabled: boolean
  className?: string
  placeholder: string
  state: ReturnType<typeof useAsyncSelectFieldState<TParams>>
  getValue: (item: T) => string
  commandProps: Omit<AsyncSelectCommandProps<T>, "items" | "isFetching" | "error">
}

function AsyncSelectEager<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
>({
  value,
  useDataHook,
  selectedItemFromData,
  getItemDisplayValue,
  disabled,
  className,
  placeholder,
  state,
  getValue,
  commandProps,
}: AsyncSelectEagerProps<T, TParams>) {
  const { data, isFetching, error } = useDataHook(state.params)

  const items = React.useMemo(() => data?.data?.items ?? [], [data])

  const selectedItemFromList = React.useMemo(
    () => items.find((item) => getValue(item) === value),
    [items, value, getValue],
  )

  const selectedItem = selectedItemFromList ?? selectedItemFromData

  return (
    <AsyncSelectShell
      open={state.open}
      onOpenChange={state.onOpenChange}
      triggerRef={state.triggerRef}
      disabled={disabled}
      className={className}
      selectedItem={selectedItem}
      getItemDisplayValue={getItemDisplayValue}
      placeholder={placeholder}
      contentWidth={state.contentWidth}
    >
      <AsyncSelectCommand
        {...commandProps}
        items={items}
        isFetching={isFetching}
        error={error}
      />
    </AsyncSelectShell>
  )
}