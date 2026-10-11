import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"

import * as React from "react"

/**
 * Typography variants supported by the design system.
 */
const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-bold tracking-tight text-balance lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",

      p: "leading-7",

      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm leading-none",
      muted: "text-sm text-muted-foreground",

      blockquote: "border-l-2 border-border pl-6 italic text-muted-foreground",

      list: "ml-6 list-disc marker:text-muted-foreground [&>li]:mt-2",

      inlineCode:
        "rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-medium",

      code: "block overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-sm",

      table: "w-full text-sm",

      thead: "[&_tr]:border-b",
      tbody: "[&_tr:last-child]:border-0",

      tr: "border-b hover:bg-muted/50",
      th: "px-3 py-2 text-left font-medium",
      td: "px-3 py-2",

      anchor: "text-primary underline underline-offset-4 hover:text-primary/80",

      hr: "border-border",
    },

    spacing: {
      none: "",
      sm: "space-y-2",
      md: "space-y-4",
      lg: "space-y-6",
    },

    prose: {
      true: "[&:not(:first-child)]:mt-6",
      false: "",
    },
  },

  defaultVariants: {
    variant: "p",
    spacing: "none",
    prose: false,
  },
})

const variantMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",

  p: "p",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",

  blockquote: "blockquote",
  list: "ul",

  inlineCode: "code",
  code: "pre",

  table: "table",
  thead: "thead",
  tbody: "tbody",
  tr: "tr",
  th: "th",
  td: "td",

  anchor: "a",
  hr: "hr",
} as const

export type TypographyVariant = keyof typeof variantMapping

/**
 * Typography component props
 */
export interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /**
   * Visual style variant of typography
   * @default "p"
   */
  variant?: TypographyVariant

  /**
   * Replace root element using Radix Slot
   */
  asChild?: boolean

  /**
   * Disable text selection
   */
  disableSelect?: boolean

  /**
   * Add automatic vertical spacing (useful for prose/articles)
   */
  prose?: boolean
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant = "p",
      spacing,
      prose,
      asChild = false,
      disableSelect = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : (variantMapping[variant] as React.ElementType)

    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant, spacing, prose }),
          disableSelect && "select-none",
          className,
        )}
        {...props}
      />
    )
  },
)

Typography.displayName = "Typography"

export { Typography, typographyVariants }
