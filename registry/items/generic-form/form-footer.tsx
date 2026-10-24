"use client"

import { Button } from "@/components/ui/button"
import type { FC, ReactNode } from "react"

type FormFooterProps = {
  mode: "create" | "update"
  isLoading?: boolean
  onCancel?: () => void
  cancelLabel?: string
  submitLabel?: string
  children?: ReactNode
}

export const FormFooter: FC<FormFooterProps> = ({
  mode,
  isLoading,
  onCancel,
  cancelLabel = "Cancel",
  submitLabel,
  children,
}) => (
  <footer className="border-border bg-muted/60 sticky -bottom-4 z-10 -mx-4 -mb-4 flex flex-col gap-3 border-t px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
    {children}
    <div className="flex flex-col-reverse gap-2 sm:flex-row">
      {onCancel ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isLoading}
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          {cancelLabel}
        </Button>
      ) : null}
      <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
        {submitLabel ?? (mode === "create"
          ? isLoading
            ? "Creating..."
            : "Create"
          : isLoading
            ? "Updating..."
            : "Update")}
      </Button>
    </div>
  </footer>
)