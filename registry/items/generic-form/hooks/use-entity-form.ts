"use client"

import { useEffect, useRef } from "react"

import type { GenericFormRef } from "../generic-form"
import { getDirtyPayload } from "./get-dirty-payload"

export function useEntityForm<T extends Record<string, unknown>>({
  mode = "create",
  onSubmit,
  defaultValues,
  defaultFromArgsValues,
}: {
  mode?: "create" | "update"
  onSubmit?: (values: T) => Promise<boolean>
  defaultValues: Partial<T>
  defaultFromArgsValues?: Partial<T>
}) {
  const formRef = useRef<GenericFormRef<T>>(null)

  useEffect(() => {
    if (defaultFromArgsValues) formRef.current?.reset(defaultFromArgsValues)
  }, [defaultFromArgsValues])

  const handleSubmit = async (data: T) => {
    const dirtyFields = formRef.current?.formState.dirtyFields ?? {}
    if (mode === "update" && !Object.keys(dirtyFields).length) return
    if (!onSubmit) return

    const payload =
      mode === "create" ? data : getDirtyPayload(data, dirtyFields)
    const isSuccess = await onSubmit(payload as T)
    if (mode === "create" && isSuccess) formRef.current?.reset(defaultValues)
  }

  return {
    formRef,
    handleSubmit,
    initialValues:
      mode === "create" ? defaultValues : (defaultFromArgsValues ?? {}),
  }
}
