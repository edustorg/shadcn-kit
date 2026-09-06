"use client"

import * as React from "react"
import { z } from "zod"

import { GenericForm, type GenericFormRef } from "./generic-form"
import { TextField } from "./text-field"

const previewSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Max 50 characters"),
  email: z.string().email("Enter a valid email address"),
})

type PreviewValues = z.infer<typeof previewSchema>

type MockSubmitResult = { ok: boolean; message?: string }

function mockSubmit(values: PreviewValues): Promise<MockSubmitResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ok: true, message: JSON.stringify(values) })
    }, 800)
  })
}

export function Preview() {
  const formRef = React.useRef<GenericFormRef<PreviewValues>>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [result, setResult] = React.useState<MockSubmitResult | null>(null)

  const handleSubmit = async (values: PreviewValues) => {
    setIsSubmitting(true)
    setResult(null)
    const res = await mockSubmit(values)
    setIsSubmitting(false)
    setResult(res)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 py-4">
      <GenericForm
        ref={formRef}
        schema={previewSchema}
        initialValues={{ name: "", email: "" }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <TextField name="name" label="Name" required placeholder="John Doe" />
        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-8 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => formRef.current?.reset({ name: "", email: "" })}
            className="h-8 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </GenericForm>

      <div className="text-muted-foreground border-t pt-3 text-sm">
        {result?.ok
          ? `Sent: ${result.message}`
          : isSubmitting
            ? "Sending..."
            : "Submit the form to see validated values here."}
      </div>
    </div>
  )
}