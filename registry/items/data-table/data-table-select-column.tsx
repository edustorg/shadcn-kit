import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"

type GetSelectColumnOptions<TData> = {
  indexValue?: (row: TData) => string | number | null | undefined
  selectAllLabel?: string
  selectRowLabel?: string
  size?: number
}

export const getSelectColumn = <TData,>({
  indexValue,
  selectAllLabel = "Select all",
  selectRowLabel = "Select row",
  size = 8,
}: GetSelectColumnOptions<TData> = {}): ColumnDef<TData> => {
  return {
    id: "select",
    header: ({ table }) => {
      const checkbox = (
        <Checkbox
          aria-label={selectAllLabel}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      )

      if (!indexValue) return checkbox

      return (
        <div className="flex items-center gap-2">
          {checkbox}
          <span> #</span>
        </div>
      )
    },
    cell: ({ row }) => {
      const checkbox = (
        <Checkbox
          aria-label={selectRowLabel}
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      )

      if (!indexValue) return checkbox

      const value = indexValue(row.original)

      return (
        <div className="flex items-center gap-2">
          {checkbox}
          {value != null ? (
            <span>{value}</span>
          ) : (
            <span className="text-muted-foreground">&mdash;</span>
          )}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size,
  }
}
