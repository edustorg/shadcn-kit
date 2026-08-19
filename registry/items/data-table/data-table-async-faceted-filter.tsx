"use client";

import type { Column } from "@tanstack/react-table";
import { Check, PlusCircle, XCircle } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "./hooks/use-debounced-callback";
import type { AsyncColumnOptions } from "./types/data-table";

interface DataTableAsyncFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  asyncOptions: AsyncColumnOptions;
}

export function DataTableAsyncFacetedFilter<TData, TValue>({
  column,
  title,
  asyncOptions,
}: DataTableAsyncFacetedFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const debouncedSetSearch = useDebouncedCallback(
    setDebouncedSearch,
    asyncOptions.debounceDelay ?? 300,
  );

  const onOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch("");
      setDebouncedSearch("");
    }
  }, []);

  const columnFilterValue = column?.getFilterValue();
  const selectedValues = React.useMemo(
    () =>
      new Set<string>(
        Array.isArray(columnFilterValue) ? columnFilterValue : [],
      ),
    [columnFilterValue],
  );

  const searchParamKey = asyncOptions.searchParamKey ?? "search";
  const optionsParams = React.useMemo(() => {
    return {
      [searchParamKey]: debouncedSearch || undefined,
      limit: 50,
      ...asyncOptions.additionalParams,
    } as Record<string, unknown>;
  }, [debouncedSearch, searchParamKey, asyncOptions]);

  const {
    data: optionsData,
    isFetching,
    error,
  } = asyncOptions.useDataHook(optionsParams);

  const options = React.useMemo(() => {
    const items = optionsData?.data?.items ?? [];
    const getItemValue =
      asyncOptions.getItemValue ??
      ((item: unknown) => (item as { id?: string }).id ?? "");

    return items
      .map((item) => ({
        value: getItemValue(item),
        label: asyncOptions.getItemLabel(item),
      }))
      .filter((option) => option.value);
  }, [optionsData, asyncOptions]);

  const missingSelectedIds = React.useMemo(
    () =>
      Array.from(selectedValues).filter(
        (value) => !options.some((option) => option.value === value),
      ),
    [selectedValues, options],
  );

  const onItemSelect = React.useCallback(
    (value: string, isSelected: boolean) => {
      if (!column) return;

      const newSelectedValues = new Set(selectedValues);
      if (isSelected) {
        newSelectedValues.delete(value);
      } else {
        newSelectedValues.add(value);
      }
      const filterValues = Array.from(newSelectedValues);
      column.setFilterValue(filterValues.length ? filterValues : undefined);
    },
    [column, selectedValues],
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      column?.setFilterValue(undefined);
    },
    [column],
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-dashed font-normal"
        >
          {selectedValues?.size > 0 ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={onReset}
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  <>
                    {options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="rounded-sm px-1 font-normal"
                        >
                          {option.label}
                        </Badge>
                      ))}
                    {missingSelectedIds.length > 0 && (
                      <SelectedItemsLabels
                        ids={missingSelectedIds}
                        asyncOptions={asyncOptions}
                      />
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              debouncedSetSearch(value);
            }}
          />
          <CommandList className="max-h-full">
            {error ? (
              <CommandEmpty>Failed to load options.</CommandEmpty>
            ) : isFetching ? (
              <div className="flex items-center justify-center py-6 text-sm">
                Loading...
              </div>
            ) : options.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <CommandGroup className="max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden">
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => onItemSelect(option.value, isSelected)}
                    >
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check />
                      </div>
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onReset()}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface SelectedItemsLabelsProps {
  ids: string[];
  asyncOptions: AsyncColumnOptions;
}

function SelectedItemsLabels({
  ids,
  asyncOptions,
}: SelectedItemsLabelsProps) {
  const params = React.useMemo(() => {
    return {
      filter_by_ids: ids,
      limit: 50,
      ...asyncOptions.additionalParams,
    } as Record<string, unknown>;
  }, [ids, asyncOptions]);

  const { data } = asyncOptions.useDataHook(params);
  const items = data?.data?.items ?? [];

  const getItemValue =
    asyncOptions.getItemValue ??
    ((item: unknown) => (item as { id?: string }).id ?? "");

  return (
    <>
      {items.map((item) => (
        <Badge
          variant="secondary"
          key={getItemValue(item)}
          className="rounded-sm px-1 font-normal"
        >
          {asyncOptions.getItemLabel(item)}
        </Badge>
      ))}
    </>
  );
}
