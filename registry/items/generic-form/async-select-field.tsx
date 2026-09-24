"use client"

import { useDebouncedCallback } from "@/components/edust-kit/hooks/use-debounced-callback"
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

export interface AsyncSelectPagination {
  hasNextPage?: boolean
  nextPage?: number | null
}

export interface AsyncSelectData<T> {
  data?: { items?: T[] }
  pagination?: AsyncSelectPagination
}

export interface AsyncSelectQueryResult<T> {
  data?: AsyncSelectData<T>
  isFetching: boolean
  error: unknown
  refetch?: () => unknown
}

export interface AsyncSelectFieldProps<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
> {
  value?: string
  onChange: (id: string) => void
  placeholder?: string
  debounceDelay?: number
  searchPlaceholder?: string
  searchParamKey?: keyof TParams
  useDataHook: (params: TParams) => AsyncSelectQueryResult<T>
  selectedItemData?: AsyncSelectData<T>
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

interface AsyncSelectCachedPage<T> {
  items: T[]
  hasNextPage: boolean
  nextPage: number | null
}

interface AsyncSelectPageCache<T> {
  key: string
  pages: Map<number, AsyncSelectCachedPage<T>>
}

interface AsyncSelectPageStore<T> {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => AsyncSelectPageCache<T>
  setPage: (
    key: string,
    page: number,
    pageData: AsyncSelectCachedPage<T>,
  ) => void
}

interface AsyncSelectPageRequest {
  key: string
  page: number
  hasNextPage: boolean
  nextPage: number | null
}

function areAsyncSelectItemsEqual<T>(
  previous: T[] | undefined,
  next: T[],
): boolean {
  return (
    previous !== undefined &&
    previous.length === next.length &&
    previous.every((item, index) => item === next[index])
  )
}

function createAsyncSelectPageStore<T>(): AsyncSelectPageStore<T> {
  let snapshot: AsyncSelectPageCache<T> = {
    key: "",
    pages: new Map(),
  }
  const listeners = new Set<() => void>()

  return {
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => snapshot,
    setPage: (key, page, pageData) => {
      const previousPage =
        snapshot.key === key ? snapshot.pages.get(page) : undefined
      if (
        previousPage &&
        areAsyncSelectItemsEqual(previousPage.items, pageData.items) &&
        previousPage.hasNextPage === pageData.hasNextPage &&
        previousPage.nextPage === pageData.nextPage
      ) {
        return
      }

      const pages = snapshot.key === key ? new Map(snapshot.pages) : new Map()
      pages.set(page, pageData)
      snapshot = { key, pages }
      listeners.forEach((listener) => listener())
    },
  }
}

function createAsyncSelectPageRequest(key: string): AsyncSelectPageRequest {
  return {
    key,
    page: 1,
    hasNextPage: false,
    nextPage: null,
  }
}

interface UseAsyncSelectPagesConfig<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
> {
  useDataHook: (params: TParams) => AsyncSelectQueryResult<T>
  params: TParams
  getItemKey?: (item: T) => string
  getItemValue: (item: T) => string
}

function useAsyncSelectPages<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
>({
  useDataHook,
  params,
  getItemKey,
  getItemValue,
}: UseAsyncSelectPagesConfig<T, TParams>) {
  const paramsKey = React.useMemo(() => JSON.stringify(params) ?? "", [params])
  const [pageRequest, setPageRequest] = React.useState<AsyncSelectPageRequest>(
    () => createAsyncSelectPageRequest(paramsKey),
  )
  const [pageStore] = React.useState(() => createAsyncSelectPageStore<T>())
  const pageCache = React.useSyncExternalStore(
    pageStore.subscribe,
    pageStore.getSnapshot,
    pageStore.getSnapshot,
  )
  const isCurrentRequest = pageRequest.key === paramsKey
  const currentPage = isCurrentRequest ? pageRequest.page : 1
  const queryParams = React.useMemo(
    () => ({ ...params, page: currentPage }) as TParams,
    [params, currentPage],
  )
  const { data, isFetching, error, refetch } = useDataHook(queryParams)
  const pageItems = React.useMemo(() => data?.data?.items ?? [], [data])
  const hasNextPage = data?.pagination?.hasNextPage ?? false
  const nextPage = data?.pagination?.nextPage ?? null
  const emptyPages = React.useMemo(
    () => new Map<number, AsyncSelectCachedPage<T>>(),
    [],
  )
  const cachedPages = pageCache.key === paramsKey ? pageCache.pages : emptyPages
  const cachedPage = cachedPages.get(currentPage)
  const currentDataIsUsable =
    data !== undefined &&
    (isCurrentRequest || (currentPage === 1 && !isFetching))
  const currentPageEntry = React.useMemo(() => {
    if (currentDataIsUsable) {
      return {
        items: pageItems,
        hasNextPage,
        nextPage: nextPage ?? (hasNextPage ? currentPage + 1 : null),
      }
    }

    return (
      cachedPage ?? {
        items: [],
        hasNextPage: isCurrentRequest && pageRequest.hasNextPage,
        nextPage: isCurrentRequest ? pageRequest.nextPage : null,
      }
    )
  }, [
    cachedPage,
    currentDataIsUsable,
    currentPage,
    hasNextPage,
    isCurrentRequest,
    nextPage,
    pageItems,
    pageRequest.hasNextPage,
    pageRequest.nextPage,
  ])

  React.useEffect(() => {
    if (!data || (!isCurrentRequest && isFetching)) return

    pageStore.setPage(paramsKey, currentPage, {
      items: pageItems,
      hasNextPage,
      nextPage: nextPage ?? (hasNextPage ? currentPage + 1 : null),
    })
  }, [
    currentPage,
    data,
    hasNextPage,
    isFetching,
    isCurrentRequest,
    nextPage,
    pageItems,
    pageStore,
    paramsKey,
  ])

  const items = React.useMemo(() => {
    const pageMap = new Map(cachedPages)
    if (currentDataIsUsable) {
      pageMap.set(currentPage, currentPageEntry)
    }

    const seen = new Set<string>()
    return [...pageMap.entries()]
      .sort(([pageA], [pageB]) => pageA - pageB)
      .flatMap(([, page]) =>
        page.items.filter((item) => {
          const itemKey = getItemKey ? getItemKey(item) : getItemValue(item)
          if (seen.has(itemKey)) return false
          seen.add(itemKey)
          return true
        }),
      )
  }, [
    cachedPages,
    currentDataIsUsable,
    currentPage,
    currentPageEntry,
    getItemKey,
    getItemValue,
  ])

  const loadMore = React.useCallback(() => {
    if (isFetching || !currentPageEntry.hasNextPage) return

    if (currentDataIsUsable) {
      pageStore.setPage(paramsKey, currentPage, currentPageEntry)
    }

    const targetPage = currentPageEntry.nextPage ?? currentPage + 1
    if (targetPage === currentPage && currentDataIsUsable) return
    if (targetPage === currentPage && refetch) {
      void refetch()
      return
    }

    setPageRequest({
      key: paramsKey,
      page: targetPage,
      hasNextPage: currentPageEntry.hasNextPage,
      nextPage: currentPageEntry.nextPage,
    })
  }, [
    currentDataIsUsable,
    currentPage,
    currentPageEntry,
    isFetching,
    pageStore,
    paramsKey,
    refetch,
  ])

  return {
    items,
    isFetching,
    isFetchingNextPage: isFetching && currentPage > 1,
    error,
    hasNextPage: currentPageEntry.hasNextPage,
    loadMore,
  }
}

interface AsyncSelectCommandProps<T extends SelectFieldItem> {
  search: string
  setSearch: (value: string) => void
  debouncedSetSearch: (value: string) => void
  searchPlaceholder: string
  showSearchIcon: boolean
  items: T[]
  isFetching: boolean
  isFetchingNextPage: boolean
  error: unknown
  hasNextPage: boolean
  loadMore: () => void
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
  isFetchingNextPage,
  error,
  hasNextPage,
  loadMore,
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
            {search ? "No items found." : "No items available."}
          </CommandEmpty>
        ) : (
          <>
            <CommandGroup>
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

interface UseAsyncSelectFieldStateConfig<TParams extends BaseSelectParams> {
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
> extends Omit<
  AsyncSelectCommandProps<T>,
  | "items"
  | "isFetching"
  | "isFetchingNextPage"
  | "error"
  | "hasNextPage"
  | "loadMore"
> {
  params: TParams
  useDataHook: AsyncSelectFieldProps<T, TParams>["useDataHook"]
}

function AsyncSelectLazyBody<
  T extends SelectFieldItem,
  TParams extends BaseSelectParams,
>({
  params,
  useDataHook,
  ...commandProps
}: AsyncSelectLazyBodyProps<T, TParams>) {
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
    <AsyncSelectCommand
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
  commandProps: Omit<
    AsyncSelectCommandProps<T>,
    | "items"
    | "isFetching"
    | "isFetchingNextPage"
    | "error"
    | "hasNextPage"
    | "loadMore"
  >
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
        isFetchingNextPage={isFetchingNextPage}
        error={error}
        hasNextPage={hasNextPage}
        loadMore={loadMore}
      />
    </AsyncSelectShell>
  )
}
