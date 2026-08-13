# shadcn-kit

A [shadcn](https://ui.shadcn.com)-compatible component registry, distributed as a public
GitHub repository. No server, no build step — the repo *is* the registry.

This repo is also a real Next.js + shadcn project (`base-nova` preset) so components can be
developed, previewed, and installed from shadcn's core library before being published as
registry items.

## Requirements (for consumers)

- A project already initialized with [shadcn](https://ui.shadcn.com) (`npx shadcn@latest init`)
- Tailwind CSS v4
- React 18+

## Install

Once this repository is public on GitHub, these commands work as-is:

```bash
# Button
npx shadcn@latest add edustorg/shadcn-kit/button

# Badge (installs custom success/warning/info variants + their CSS variables)
npx shadcn@latest add edustorg/shadcn-kit/badge
```

The CLI installs the components into your project's `ui` directory under a `shadcn-kit/`
subfolder (so they never collide with your existing UI components), installs their
dependencies (`class-variance-authority`, `@base-ui/react`), pulls the `utils` helper, and
adds any custom CSS variables to your theme.

## Usage

```tsx
import { Button } from "@/components/ui/shadcn-kit/button";
import { Badge } from "@/components/ui/shadcn-kit/badge";

export function App() {
  return (
    <div className="flex gap-2">
      <Button>Default</Button>
      <Button variant="destructive">Delete</Button>
      <Badge>Default</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="info">New</Badge>
    </div>
  );
}
```

### Button

| Prop      | Type                                                                               | Default   |
| --------- | ---------------------------------------------------------------------------------- | --------- |
| `variant` | `default` \| `outline` \| `secondary` \| `ghost` \| `destructive` \| `link`        | `default` |
| `size`    | `xs` \| `sm` \| `default` \| `lg` \| `icon` \| `icon-xs` \| `icon-sm` \| `icon-lg` | `default` |

Forwards all `@base-ui/react` button props. See `buttonVariants` (from
`class-variance-authority`) for composing custom markup.

### Badge

| Prop      | Type                                                                                           | Default   |
| --------- | ---------------------------------------------------------------------------------------------- | --------- |
| `variant` | `default` \| `secondary` \| `destructive` \| `success` \| `warning` \| `info` \| `outline` \| `ghost` \| `link` | `default` |

`success`, `warning`, and `info` are custom variants. Their color tokens are shipped with the
registry item via `cssVars` and are added to the consumer's theme automatically.

## Components

| Item     | Type          | Description                                                          |
| -------- | ------------- | -------------------------------------------------------------------- |
| `button` | `registry:ui` | shadcn base-nova button with variants and sizes.                     |
| `badge`  | `registry:ui` | shadcn badge extended with `success`, `warning`, `info` variants.    |

## Adding more items

The workflow: **install a core shadcn component, customize it, publish it.**

1. Install a shadcn core component locally:

   ```bash
   pnpm dlx shadcn@latest add input
   ```

2. Customize it (e.g. add a new `variant` in the `cva()` config and any new color tokens to
   `src/app/globals.css`).
3. Create an item folder at `registry/items/components/{name}/` containing:
   - `{name}.tsx` — the source component (imports use `@/lib/utils`).
   - `_registry.mdx` — frontmatter with `name`, `type`, `title`, `description`,
     `dependencies`, `registryDependencies` (bare `"utils"` resolves to shadcn's official
     utility), and optional `cssVars` (light + dark). Free-form markdown body becomes the
     Usage section on the site.
   - `_preview.tsx` — a `"use client"` component that renders the item's preview.
4. Regenerate the catalog and previews (runs automatically on `dev`/`build`):

   ```bash
   pnpm generate
   ```

   This writes `registry.json`, `src/lib/registry/generated/catalog.ts`, and
   `src/lib/registry/generated/previews.ts`.
5. Validate locally:

   ```bash
   pnpm validate
   ```

## Local development

```bash
pnpm install
pnpm generate   # regenerate registry.json + generated catalog/previews
pnpm dev        # preview the docs site at http://localhost:3000
pnpm build      # production build (runs generate first)
pnpm typecheck  # type-check the app, components, and registry sources
pnpm validate   # validate registry.json against the registry schema
```

The docs site serves the registry over HTTP too:

```bash
curl http://localhost:3000/registry.json   # registry catalog
curl http://localhost:3000/r/button.json   # single registry item
```

The registry can also be checked end-to-end once public:

```bash
npx shadcn@latest registry validate edustorg/shadcn-kit
npx shadcn@latest list edustorg/shadcn-kit
```

## Licensing

Components in this registry are from the [shadcn/ui](https://ui.shadcn.com) core library
(MIT licensed) and extended by shadcn-kit. Dependencies (`@base-ui/react`,
`class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss`) are permissively
licensed, so the registry can be freely reused.

This repository is licensed under the [MIT License](./LICENSE).
