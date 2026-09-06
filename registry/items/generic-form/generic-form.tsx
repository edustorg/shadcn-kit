"use client"

import * as React from "react"
import {
  Control,
  DefaultValues,
  FieldValues,
  FormProvider,
  FormState,
  Path,
  Resolver,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ZodType } from "zod"

export interface GenericFormRef<TValues extends FieldValues> {
  /** Get the current form values. */
  getValues: () => TValues
  /** Reset the form to the given (or initial) values. */
  reset: (values?: Partial<TValues>) => void
  /** Set a single field value. */
  setValue: (name: keyof TValues, value: TValues[keyof TValues]) => void
  formState: FormState<TValues>
  control: Control<TValues>
  form: UseFormReturn<TValues>
}

export interface GenericFormProps<
  TValues extends FieldValues,
  TSchema extends ZodType<TValues, TValues>,
> {
  schema: TSchema
  initialValues: Partial<TValues>
  onSubmit: SubmitHandler<TValues>
  children: React.ReactNode
  ref?: React.Ref<GenericFormRef<TValues>>
  className?: string
}

/**
 * A schema-driven generic form built on react-hook-form and zod.
 *
 * Provides the form instance through `FormProvider` so field components can
 * read context with `useFormContext()`, and exposes an imperative handle via
 * `useImperativeHandle` for `getValues`, `reset`, `setValue`, `formState`,
 * `control`, and the full `form` instance.
 */
export const GenericForm = <
  TValues extends FieldValues,
  TSchema extends ZodType<TValues, TValues>,
>({
  ref,
  initialValues,
  schema,
  onSubmit,
  children,
  className,
  ...formProps
}: GenericFormProps<TValues, TSchema>) => {
  const form = useForm<TValues>({
    resolver: zodResolver(schema) as Resolver<TValues>,
    defaultValues: initialValues as DefaultValues<TValues>,
  })

  React.useImperativeHandle(ref, () => ({
    getValues: form.getValues,
    reset: (values?: Partial<TValues>) => form.reset(values as TValues),
    setValue: (name: keyof TValues, value: TValues[keyof TValues]) =>
      form.setValue(name as Path<TValues>, value),
    formState: form.formState,
    control: form.control,
    form,
  }))

  return (
    <FormProvider {...form}>
      <form
        {...formProps}
        className={className}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  )
}

GenericForm.displayName = "GenericForm"