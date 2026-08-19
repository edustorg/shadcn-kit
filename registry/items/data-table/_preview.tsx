"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { DataTable } from "./data-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableSortList } from "./data-table-sort-list";
import { DataTableAdvancedToolbar } from "./data-table-advanced-toolbar";
import { DataTableFilterList } from "./data-table-filter-list";
import { DataTableFilterMenu } from "./data-table-filter-menu";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const USER_NAMES: Record<number, string> = {
  1: "Leanne Graham",
  2: "Ervin Howell",
  3: "Clementine Bauch",
  4: "Patricia Lebsack",
  5: "Chelsey Dietrich",
};

const STATUS_OPTIONS = [
  { label: "Todo", value: "false" },
  { label: "Done", value: "true" },
];

export function Preview() {
  const [useAdvanced, setUseAdvanced] = React.useState(false);
  const [data, setData] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=25")
      .then((res) => res.json())
      .then((todos: Todo[]) => {
        if (!cancelled) {
          setData(todos);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
          <span className="max-w-[400px] truncate">{row.getValue("title")}</span>
        ),
      },
      {
        id: "userId",
        accessorKey: "userId",
        header: "Assignee",
        meta: {
          label: "Assignee",
          variant: "select",
          options: Object.entries(USER_NAMES).map(([id, name]) => ({
            label: name,
            value: id,
          })),
        },
        enableColumnFilter: true,
        enableSorting: true,
        cell: ({ row }) => {
          const uid = row.getValue("userId") as number;
          return USER_NAMES[uid] ?? `User ${uid}`;
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
          const done = row.getValue("completed");
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
          );
        },
      },
    ],
    [],
  );

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
  });

  if (loading) {
    return <div className="text-muted-foreground text-sm">Loading todos...</div>;
  }

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
      <DataTable table={table}>
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
  );
}
