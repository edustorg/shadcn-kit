"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import type { GenericFormRef } from "../generic-form"
import { extractAxiosErrorMessage } from "./extract-axios-error-message"
import { getDirtyPayload } from "./get-dirty-payload"
import { responseStatus } from "./response-status"

type TranslateFn = (key: string) => string

export type UseEntityFormOptions<T extends Record<string, unknown>> = {
  mode?: "create" | "update"
  onSubmit?: (values: T) => Promise<boolean>
  defaultValues: Partial<T>
  defaultFromArgsValues?: Partial<T>
  t?: TranslateFn
  messages?: {
    noChanges?: string
    createError?: string
    updateError?: string
    refusalTitle?: string
  }
  dateNullKeys?: readonly (keyof T)[]
  mapPayload?: (args: {
    values: T
    dirtyValues: Partial<T>
    dirtyFields: Record<string, unknown>
    mode: "create" | "update"
  }) => T | Partial<T>
  on422?: (error: unknown) => void
  onError?: (error: unknown) => void
  resetOnCreateSuccess?: boolean
  onNoChanges?: () => void
  onSuccess?: (payload: T | Partial<T>) => void
  onErrorToast?: (message: string) => void
}

const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (typeof a !== "object" || typeof b !== "object") return a === b
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }
  if (Array.isArray(a) || Array.isArray(b)) return false
  const keysA = Object.keys(a as Record<string, unknown>)
  const keysB = Object.keys(b as Record<string, unknown>)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false
    }
  }
  return true
}

export function useEntityForm<T extends Record<string, unknown>>({
  mode = "create",
  onSubmit,
  defaultValues,
  defaultFromArgsValues,
  t,
  messages = {},
  dateNullKeys = [],
  mapPayload,
  on422,
  onError,
  resetOnCreateSuccess = true,
  onNoChanges,
  onSuccess,
  onErrorToast,
}: UseEntityFormOptions<T>) {
  const formRef = useRef<GenericFormRef<T>>(null)
  const [refusal, setRefusal] = useState<string | null>(null)
  const initialSnapshotRef = useRef<Partial<T> | null>(null)
  const hasResetRef = useRef(false)

  const translate = (key: string) => (t ? t(key) : undefined)

  useEffect(() => {
    if (!defaultFromArgsValues) return
    const form = formRef.current
    if (!form) return

    if (!hasResetRef.current || !form.formState.isDirty) {
      form.reset(defaultFromArgsValues)
      initialSnapshotRef.current = { ...(defaultFromArgsValues as T) }
      hasResetRef.current = true
    }
  }, [defaultFromArgsValues])

  const handleSubmit = async (data: T): Promise<boolean> => {
    const form = formRef.current
    const dirtyFields = (form?.formState?.dirtyFields ?? {}) as Record<string, unknown>

    let isDirty = Object.keys(dirtyFields).length > 0

    if (mode === "update" && !isDirty && initialSnapshotRef.current) {
      const initial = initialSnapshotRef.current as Record<string, unknown>
      const current = data as Record<string, unknown>
      const keys = new Set([...Object.keys(initial), ...Object.keys(current)])
      for (const key of keys) {
        if (!isEqual(initial[key], current[key])) {
          isDirty = true
          break
        }
      }
    }

    if (mode === "update" && !isDirty) {
      const noChangesMsg =
        messages.noChanges ?? translate("form.noChanges") ?? "No changes to update"

      if (onNoChanges) {
        onNoChanges()
      } else {
        toast.info(noChangesMsg)
      }

      return false
    }

    let dirtyValues: Partial<T> = data

    if (mode === "update") {
      dirtyValues =
        isDirty && Object.keys(dirtyFields).length > 0
          ? (getDirtyPayload(data, dirtyFields as never) as Partial<T>)
          : ({ ...(data as object) } as Partial<T>)

      if (dateNullKeys.length) {
        for (const key of dateNullKeys) {
          const keyStr = key as string
          if (
            (dirtyFields[keyStr] ||
              !isEqual(initialSnapshotRef.current?.[key], (data as any)[key])) &&
            dirtyValues[key] === undefined
          ) {
            ;(dirtyValues as Record<string, unknown>)[keyStr] = null
          }
        }
      }
    }

    const payload =
      mapPayload?.({
        values: data,
        dirtyValues,
        dirtyFields,
        mode,
      }) ?? (mode === "create" ? data : dirtyValues)

    try {
      const isSuccess = onSubmit ? await onSubmit(payload as T) : false

      if (!isSuccess) {
        return false
      }

      setRefusal(null)
      onSuccess?.(payload)

      if (mode === "create" && resetOnCreateSuccess) {
        form?.reset(defaultValues)
        initialSnapshotRef.current = { ...(defaultValues as T) }
        hasResetRef.current = true
      } else if (mode === "update") {
        form?.reset(data as T)
        initialSnapshotRef.current = { ...(data as T) }
      }

      return true
    } catch (error) {
      if (responseStatus(error) === 422) {
        const refusalMsg = extractAxiosErrorMessage(error)
        setRefusal(refusalMsg)
        on422?.(error)
        return false
      }

      const fallbackKey = mode === "create" ? "create.error" : "update.error"
      const fallbackMsg =
        messages[mode === "create" ? "createError" : "updateError"] ??
        translate(fallbackKey)

      const errorMsg = extractAxiosErrorMessage(error, fallbackMsg)

      if (onErrorToast) {
        onErrorToast(errorMsg)
      } else {
        toast.error(errorMsg)
      }

      onError?.(error)
      return false
    }
  }

  return {
    formRef,
    handleSubmit,
    initialValues: mode === "create" ? defaultValues : (defaultFromArgsValues ?? {}),
    refusal,
    setRefusal,
  }
}
