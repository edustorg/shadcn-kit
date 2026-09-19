"use client"

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { CalendarIcon, Check, X } from "lucide-react"

import * as React from "react"

import { DataTable } from "./data-table"
import { DataTableAdvancedToolbar } from "./data-table-advanced-toolbar"
import { DataTableDateFilter } from "./data-table-date-filter"
import { DataTableFilterList } from "./data-table-filter-list"
import { DataTableSortList } from "./data-table-sort-list"
import { DataTableToolbar } from "./data-table-toolbar"
import { formatDate } from "./lib/date-format"
import type { AsyncColumnOptions } from "./types/data-table"

type Todo = {
  userId: number
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

const USER_NAMES: Record<number, string> = {
  1: "Leanne Graham",
  2: "Ervin Howell",
  3: "Clementine Bauch",
  4: "Patricia Lebsack",
  5: "Chelsey Dietrich",
}

const ALL_USERS = [
  { id: "1", name: "Leanne Graham" },
  { id: "2", name: "Ervin Howell" },
  { id: "3", name: "Clementine Bauch" },
  { id: "4", name: "Patricia Lebsack" },
  { id: "5", name: "Chelsey Dietrich" },
]

const STATUS_OPTIONS = [
  { label: "Todo", value: "false" },
  { label: "Done", value: "true" },
]

function useAsyncUsers(params: Record<string, unknown>) {
  const search = (params.search as string) ?? ""
  const [data, setData] = React.useState<{
    data?: { items?: typeof ALL_USERS }
  }>({})
  const [isFetching, setIsFetching] = React.useState(false)
  const [error] = React.useState<unknown>(null)

  React.useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFetching(true)
    const timer = setTimeout(() => {
      if (cancelled) return
      const filtered = ALL_USERS.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()),
      )
      setData({ data: { items: filtered } })
      setIsFetching(false)
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [search])

  return { data, isFetching, error }
}

const asyncUserOptions: AsyncColumnOptions = {
  useDataHook: useAsyncUsers,
  getItemLabel: (item: unknown) => (item as { name: string }).name,
  getItemValue: (item: unknown) => (item as { id: string }).id,
  searchParamKey: "search",
}

export function Preview() {
  const [useAdvanced, setUseAdvanced] = React.useState(false)
  const [data, setData] = React.useState<Todo[]>([])
  const [isFetching, setIsFetching] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    setIsFetching(true)
    const timer = setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/todos?_limit=25")
        .then((res) => res.json())
        .then((todos: Omit<Todo, "createdAt" | "updatedAt">[]) => {
          if (!cancelled) {
            const now = new Date()
            const withDates = todos.map((todo, index) => ({
              ...todo,
              createdAt: new Date(
                now.getTime() - (index * 86400000 + Math.random() * 86400000),
              ).toISOString(),
              updatedAt: new Date(
                now.getTime() - Math.random() * 86400000,
              ).toISOString(),
            }))
            setData(withDates)
            setIsFetching(false)
          }
        })
        .catch(() => {
          if (!cancelled) setIsFetching(false)
        })
    }, 500)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  const columns = React.useMemo<ColumnDef<Todo, unknown>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        enableSorting: true,
        enableHiding: true,
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
        },
        enableColumnFilter: true,
        enableSorting: true,
        enableHiding: true,
        cell: ({ row }) => (
          <span className="max-w-[400px] truncate">
            {row.getValue("title")}
          </span>
        ),
      },
      {
        id: "userId",
        accessorKey: "userId",
        header: "Assignee",
        meta: {
          label: "Assignee",
          variant: "asyncMultiSelect",
          asyncOptions: asyncUserOptions,
        },
        enableColumnFilter: true,
        enableSorting: true,
        cell: ({ row }) => {
          const uid = row.getValue("userId") as number
          return USER_NAMES[uid] ?? `User ${uid}`
        },
      },
      {
        id: "completed",
        accessorKey: "completed",
        header: "Status",
        meta: {
          label: "Status",
          variant: "select",
          options: STATUS_OPTIONS,
        },
        enableColumnFilter: true,
        enableSorting: true,
        cell: ({ row }) => {
          const done = row.getValue("completed")
          return (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                done
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {done ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {done ? "Done" : "Todo"}
            </span>
          )
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created",
        enableSorting: true,
        enableHiding: true,
        enableColumnFilter: true,
        cell: ({ row }) =>
          formatDate(row.getValue("createdAt"), "relative-short"),
        meta: { label: "Created", variant: "dateRange", icon: CalendarIcon },
      },
      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: "Updated",
        enableSorting: true,
        enableHiding: true,
        enableColumnFilter: true,
        cell: ({ row }) => formatDate(row.getValue("updatedAt"), "relative"),
      },
    ],
    [],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: "id", desc: false }],
      pagination: { pageSize: 5 },
    },
  })

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Filter mode:</label>
        <select
          value={useAdvanced ? "advanced" : "standard"}
          onChange={(e) => setUseAdvanced(e.target.value === "advanced")}
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value="advanced">Advanced</option>
          <option value="standard">Standard</option>
        </select>
      </div>
      <DataTable
        table={table}
        isFetching={isFetching}
        skeleton={{ rowCount: 10 }}
      >
        {useAdvanced ? (
          <DataTableAdvancedToolbar table={table}>
            <DataTableFilterList table={table} align="start" />
            <DataTableSortList table={table} align="start" />
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        )}
      </DataTable>
    </div>
  )
}
