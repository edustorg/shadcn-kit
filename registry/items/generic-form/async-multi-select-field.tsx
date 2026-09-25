"use client"

import { useDebouncedCallback } from "@/components/edust-kit/hooks/use-debounced-callback"
import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChevronsUpDownIcon, XIcon } from "lucide-react"

import * as React from "react"

import {
  type AsyncSelectData,
  type AsyncSelectQueryResult,
  type BaseSelectParams,
  type SelectFieldItem,
  useAsyncSelectPages,
} from "./async-select-field"

export type { BaseSelectParams, SelectFieldItem }

export interface AsyncMultiSelectFieldProps<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
> {
  value?: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  debounceDelay?: number
  searchPlaceholder?: string
  searchParamKey?: keyof TParams
  useDataHook: (params: TParams) => AsyncSelectQueryResult<T>
  selectedItemsData?: AsyncSelectData<T>
  getItemDisplayValue: (item: T) => string
  getItemKey?: (item: T) => string
  getItemValue?: (item: T) => string
  renderItemLabel?: (item: T) => React.ReactNode
  additionalParams?: Partial<Omit<TParams, keyof BaseSelectParams>>
  disabled?: boolean
  className?: string
  badgeClassName?: string
  maxSelected?: number
  maxBadges?: number
  showSearchIcon?: boolean
  lazy?: boolean
  emptyIndicator?: React.ReactNode
}

const defaultGetItemValue = (item: SelectFieldItem) => item.id

interface AsyncMultiSelectCommandProps<T extends SelectFieldItem> {
  search: string
  setSearch: (value: string) => void
  debouncedSetSearch: (value: string) => void
  searchPlaceholder: string
  showSearchIcon: boolean
  items: T[]
  value: string[]
  isFetching: boolean
  isFetchingNextPage: boolean
  error: unknown
  hasNextPage: boolean
  loadMore: () => void
  maxSelected?: number
  emptyIndicator?: React.ReactNode
  getItemKey?: (item: T) => string
  getItemValue: (item: T) => string
  getItemDisplayValue: (item: T) => string
  renderItemLabel?: (item: T) => React.ReactNode
  onToggle: (itemValue: string) => void
}

function AsyncMultiSelectCommand<T extends SelectFieldItem>({
  search,
  setSearch,
  debouncedSetSearch,
  searchPlaceholder,
  showSearchIcon,
  items,
  value,
  isFetching,
  isFetchingNextPage,
  error,
  hasNextPage,
  loadMore,
  maxSelected,
  emptyIndicator,
  getItemKey,
  getItemValue,
  getItemDisplayValue,
  renderItemLabel,
  onToggle,
}: AsyncMultiSelectCommandProps<T>) {
  const isMaxReached = maxSelected ? value.length >= maxSelected : false

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
      <CommandList
        className="max-h-75"
        onScroll={(event) => {
          const target = event.currentTarget
          const distanceFromBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight
          if (distanceFromBottom <= 48 && hasNextPage) loadMore()
        }}
      >
        {isFetching && items.length === 0 ? (
          <div className="text-muted-foreground flex items-center justify-center py-6 text-sm">
            Loading...
          </div>
        ) : error && items.length === 0 ? (
          <CommandEmpty>Failed to load items.</CommandEmpty>
        ) : items.length === 0 ? (
          <CommandEmpty>
            {isMaxReached
              ? `Maximum ${maxSelected} items selected`
              : (emptyIndicator ??
                (search ? "No items found." : "No items available."))}
          </CommandEmpty>
        ) : (
          <>
            <CommandGroup>
              {isMaxReached && (
                <p className="text-muted-foreground px-2 py-1.5 text-sm">
                  Maximum {maxSelected} items selected
                </p>
              )}
              {items.map((item) => {
                const itemValue = getItemValue(item)
                const isSelected = value.includes(itemValue)
                return (
                  <CommandItem
                    key={getItemKey ? getItemKey(item) : itemValue}
                    value={itemValue}
                    data-checked={isSelected}
                    aria-selected={isSelected}
                    onSelect={() => onToggle(itemValue)}
                    className="cursor-pointer"
                  >
                    {renderItemLabel
                      ? renderItemLabel(item)
                      : getItemDisplayValue(item)}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {isFetching && (
              <div className="text-muted-foreground flex items-center justify-center py-3 text-sm">
                {isFetchingNextPage ? "Loading more..." : "Refreshing..."}
              </div>
            )}
            {error && (
              <div className="text-destructive flex items-center justify-center py-3 text-sm">
                Failed to load more items.
              </div>
            )}
          </>
        )}
      </CommandList>
    </Command>
  )
}

function buildSelectedItems<T extends SelectFieldItem>(
  items: T[],
  extraItems: T[],
  value: string[],
  getItemValue: (item: T) => string,
): T[] {
  const byValue = new Map<string, T>()
  for (const item of [...items, ...extraItems]) {
    const itemValue = getItemValue(item)
    if (!byValue.has(itemValue)) byValue.set(itemValue, item)
  }
  return value
    .map((itemValue) => byValue.get(itemValue))
    .filter((item): item is T => Boolean(item))
}

interface UseAsyncMultiSelectFieldStateConfig<
  TParams extends BaseSelectParams,
> {
  debounceDelay: number
  searchParamKey: keyof TParams
  additionalParams: Partial<Omit<TParams, keyof BaseSelectParams>>
}

function useAsyncMultiSelectFieldState<TParams extends BaseSelectParams>({
  debounceDelay,
  searchParamKey,
  additionalParams,
}: UseAsyncMultiSelectFieldStateConfig<TParams>) {
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

  return {
    open,
    search,
    setSearch,
    debouncedSetSearch,
    triggerRef,
    contentWidth,
    onOpenChange,
    params,
  }
}

interface AsyncMultiSelectShellProps<T extends SelectFieldItem> {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  disabled: boolean
  className?: string
  value: string[]
  selectedItems: T[]
  getItemValue: (item: T) => string
  getItemDisplayValue: (item: T) => string
  placeholder: string
  badgeClassName?: string
  maxBadges: number
  contentWidth: number | undefined
  onUnselect: (item: T) => void
  onClear: () => void
  children: React.ReactNode
}

function AsyncMultiSelectShell<T extends SelectFieldItem>({
  open,
  onOpenChange,
  triggerRef,
  disabled,
  className,
  value,
  selectedItems,
  getItemValue,
  getItemDisplayValue,
  placeholder,
  badgeClassName,
  maxBadges,
  contentWidth,
  onUnselect,
  onClear,
  children,
}: AsyncMultiSelectShellProps<T>) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-auto min-h-8 w-full justify-between gap-0 px-2 py-1.5 font-normal",
            selectedItems.length === 0 && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex min-w-0 flex-wrap items-center gap-1">
            {selectedItems.length > 0 ? (
              <>
                {selectedItems.slice(0, maxBadges).map((item) => (
                  <Badge
                    key={getItemValue(item)}
                    variant="secondary"
                    className={cn(
                      "gap-1 pr-1 whitespace-nowrap",
                      badgeClassName,
                    )}
                  >
                    {getItemDisplayValue(item)}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove ${getItemDisplayValue(item)}`}
                      className="text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          e.stopPropagation()
                          onUnselect(item)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onUnselect(item)
                      }}
                    >
                      <XIcon className="size-3" />
                    </span>
                  </Badge>
                ))}
                {value.length > maxBadges && (
                  <Badge variant="outline">+{value.length - maxBadges}</Badge>
                )}
              </>
            ) : (
              <span className="truncate px-1">{placeholder}</span>
            )}
          </span>
          <span className="flex shrink-0 items-center gap-0.5">
            {selectedItems.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear all"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-full p-0.5 outline-none focus-visible:ring-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    e.stopPropagation()
                    onClear()
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
              >
                <XIcon className="size-3.5" />
              </span>
            )}
            {selectedItems.length > 0 && (
              <Separator orientation="vertical" className="mx-1 h-4" />
            )}
            <ChevronsUpDownIcon className="text-muted-foreground mr-1 size-4 shrink-0" />
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

interface AsyncMultiSelectLazyBodyProps<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
> extends Omit<
  AsyncMultiSelectCommandProps<T>,
  | "items"
  | "isFetching"
  | "isFetchingNextPage"
  | "error"
  | "hasNextPage"
  | "loadMore"
> {
  params: TParams
  useDataHook: AsyncMultiSelectFieldProps<T, TParams>["useDataHook"]
}

function AsyncMultiSelectLazyBody<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
>({
  params,
  useDataHook,
  ...commandProps
}: AsyncMultiSelectLazyBodyProps<T, TParams>) {
  const {
    items,
    isFetching,
    isFetchingNextPage,
    error,
    hasNextPage,
    loadMore,
  } = useAsyncSelectPages({
    useDataHook,
    params,
    getItemKey: commandProps.getItemKey,
    getItemValue: commandProps.getItemValue,
  })

  return (
    <AsyncMultiSelectCommand
      {...commandProps}
      items={items}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      error={error}
      hasNextPage={hasNextPage}
      loadMore={loadMore}
    />
  )
}

interface AsyncMultiSelectEagerProps<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
> {
  value: string[]
  useDataHook: AsyncMultiSelectFieldProps<T, TParams>["useDataHook"]
  selectedItemsDataItems: T[]
  getItemValue: (item: T) => string
  getItemDisplayValue: (item: T) => string
  disabled: boolean
  className?: string
  badgeClassName?: string
  placeholder: string
  maxBadges: number
  state: ReturnType<typeof useAsyncMultiSelectFieldState<TParams>>
  commandProps: Omit<
    AsyncMultiSelectCommandProps<T>,
    | "items"
    | "isFetching"
    | "isFetchingNextPage"
    | "error"
    | "hasNextPage"
    | "loadMore"
  >
  onUnselect: (item: T) => void
  onClear: () => void
}

function AsyncMultiSelectEager<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
>({
  value,
  useDataHook,
  selectedItemsDataItems,
  getItemValue,
  getItemDisplayValue,
  disabled,
  className,
  badgeClassName,
  placeholder,
  maxBadges,
  state,
  commandProps,
  onUnselect,
  onClear,
}: AsyncMultiSelectEagerProps<T, TParams>) {
  const {
    items,
    isFetching,
    isFetchingNextPage,
    error,
    hasNextPage,
    loadMore,
  } = useAsyncSelectPages({
    useDataHook,
    params: state.params,
    getItemKey: commandProps.getItemKey,
    getItemValue: commandProps.getItemValue,
  })

  const selectedItems = React.useMemo(
    () =>
      buildSelectedItems(items, selectedItemsDataItems, value, getItemValue),
    [items, selectedItemsDataItems, value, getItemValue],
  )

  return (
    <AsyncMultiSelectShell
      open={state.open}
      onOpenChange={state.onOpenChange}
      triggerRef={state.triggerRef}
      disabled={disabled}
      className={className}
      value={value}
      selectedItems={selectedItems}
      getItemValue={getItemValue}
      getItemDisplayValue={getItemDisplayValue}
      placeholder={placeholder}
      badgeClassName={badgeClassName}
      maxBadges={maxBadges}
      contentWidth={state.contentWidth}
      onUnselect={onUnselect}
      onClear={onClear}
    >
      <AsyncMultiSelectCommand
        {...commandProps}
        items={items}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        error={error}
        hasNextPage={hasNextPage}
        loadMore={loadMore}
      />
    </AsyncMultiSelectShell>
  )
}

export function AsyncMultiSelectField<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
>({
  value = [],
  onChange,
  placeholder = "Select...",
  debounceDelay = 500,
  searchPlaceholder = "Search...",
  searchParamKey = "search_by_name" as keyof TParams,
  useDataHook,
  selectedItemsData,
  getItemDisplayValue,
  getItemKey,
  getItemValue,
  renderItemLabel,
  additionalParams = {},
  disabled = false,
  className,
  badgeClassName,
  maxSelected,
  maxBadges = 4,
  showSearchIcon = false,
  lazy = false,
  emptyIndicator,
}: AsyncMultiSelectFieldProps<T, TParams>) {
  const state = useAsyncMultiSelectFieldState<TParams>({
    debounceDelay,
    searchParamKey,
    additionalParams,
  })

  const getValue = React.useMemo(
    () => getItemValue ?? defaultGetItemValue,
    [getItemValue],
  )

  const selectedItemsDataItems = React.useMemo(
    () => selectedItemsData?.data?.items ?? [],
    [selectedItemsData],
  )

  const handleToggle = React.useCallback(
    (itemValue: string) => {
      if (value.includes(itemValue)) {
        onChange(value.filter((v) => v !== itemValue))
        return
      }
      if (maxSelected && value.length >= maxSelected) return
      onChange([...value, itemValue])
    },
    [value, onChange, maxSelected],
  )

  const handleUnselect = React.useCallback(
    (item: T) => {
      onChange(value.filter((v) => v !== getValue(item)))
    },
    [value, onChange, getValue],
  )

  const handleClear = React.useCallback(() => {
    if (value.length > 0) onChange([])
  }, [value, onChange])

  const lazySelectedItems = React.useMemo(
    () => buildSelectedItems([], selectedItemsDataItems, value, getValue),
    [selectedItemsDataItems, value, getValue],
  )

  const commandProps: Omit<
    AsyncMultiSelectCommandProps<T>,
    | "items"
    | "isFetching"
    | "isFetchingNextPage"
    | "error"
    | "hasNextPage"
    | "loadMore"
  > = {
    search: state.search,
    setSearch: state.setSearch,
    debouncedSetSearch: state.debouncedSetSearch,
    searchPlaceholder,
    showSearchIcon,
    value,
    maxSelected,
    emptyIndicator,
    getItemKey,
    getItemValue: getValue,
    getItemDisplayValue,
    renderItemLabel,
    onToggle: handleToggle,
  }

  if (lazy) {
    return (
      <AsyncMultiSelectShell
        open={state.open}
        onOpenChange={state.onOpenChange}
        triggerRef={state.triggerRef}
        disabled={disabled}
        className={className}
        value={value}
        selectedItems={lazySelectedItems}
        getItemValue={getValue}
        getItemDisplayValue={getItemDisplayValue}
        placeholder={placeholder}
        badgeClassName={badgeClassName}
        maxBadges={maxBadges}
        contentWidth={state.contentWidth}
        onUnselect={handleUnselect}
        onClear={handleClear}
      >
        {state.open ? (
          <AsyncMultiSelectLazyBody
            {...commandProps}
            params={state.params}
            useDataHook={useDataHook}
          />
        ) : null}
      </AsyncMultiSelectShell>
    )
  }

  return (
    <AsyncMultiSelectEager
      value={value}
      useDataHook={useDataHook}
      selectedItemsDataItems={selectedItemsDataItems}
      getItemValue={getValue}
      getItemDisplayValue={getItemDisplayValue}
      disabled={disabled}
      className={className}
      badgeClassName={badgeClassName}
      placeholder={placeholder}
      maxBadges={maxBadges}
      state={state}
      commandProps={commandProps}
      onUnselect={handleUnselect}
      onClear={handleClear}
    />
  )
}

AsyncMultiSelectField.displayName = "AsyncMultiSelectField"
