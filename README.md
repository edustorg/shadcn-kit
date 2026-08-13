# edust-kit

Production-ready UI components for the edust platform, published as a
[shadcn-compatible registry](https://ui.shadcn.com/docs/registry) — a public GitHub
repository. No server, no build step to consume: the repo *is* the registry.

This repo is also a real Next.js + shadcn project (`base-nova` preset) so components are
developed, previewed, and installed from shadcn's core library before being published as
registry items, and the site doubles as the docs.

## For consumers

### Requirements

- A project initialized with shadcn: `npx shadcn@latest init`
- Tailwind CSS v4
- React 18+
- Node.js 20.18+

### Install

Add the registry as a namespace (one-time setup):

```bash
npx shadcn@latest registry add @edust-kit=https://raw.githubusercontent.com/edustorg/shadcn-kit/main/r/{name}.json
```

Then install components by name:

```bash
# Button
npx shadcn@latest add @edust-kit/button

# Badge (installs custom success/warning/info variants + their CSS variables)
npx shadcn@latest add @edust-kit/badge
```

Or skip the namespace and install straight from the repository — no configuration needed:

```bash
npx shadcn@latest add edustorg/shadcn-kit/button
```

Every install:

- lands in your `ui` directory under an `edust-kit/` subfolder (e.g.
  `src/components/ui/edust-kit/button.tsx`) so existing components are never overwritten,
- installs runtime dependencies (`@base-ui/react`, `class-variance-authority`),
- pulls the `utils` helper,
- merges custom CSS variables into your `globals.css`.

### Usage

```tsx
import { Button } from "@/components/ui/edust-kit/button";
import { Badge } from "@/components/ui/edust-kit/badge";

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

#### Button

| Prop      | Type                                                                               | Default   |
| --------- | ---------------------------------------------------------------------------------- | --------- |
| `variant` | `default` \| `outline` \| `secondary` \| `ghost` \| `destructive` \| `link`        | `default` |
| `size`    | `xs` \| `sm` \| `default` \| `lg` \| `icon` \| `icon-xs` \| `icon-sm` \| `icon-lg` | `default` |

Forwards all `@base-ui/react` button props. See `buttonVariants` (from
`class-variance-authority`) for composing custom markup.

#### Badge

| Prop      | Type                                                                                           | Default   |
| --------- | ---------------------------------------------------------------------------------------------- | --------- |
| `variant` | `default` \| `secondary` \| `destructive` \| `success` \| `warning` \| `info` \| `outline` \| `ghost` \| `link` | `default` |

`success`, `warning`, and `info` are custom variants. Their color tokens ship with the item
via `cssVars` and are added to the consumer's theme automatically.

## Components

| Item     | Type          | Description                                                        |
| -------- | ------------- | ------------------------------------------------------------------ |
| `button` | `registry:ui` | shadcn base-nova button with variants and sizes.                   |
| `badge`  | `registry:ui` | shadcn badge extended with `success`, `warning`, `info` variants.  |

## For contributors

### Local development

```bash
pnpm install
pnpm generate   # regenerate registry.json + generated catalog/previews
pnpm dev        # preview the docs site at http://localhost:3000
pnpm build      # production build (runs generate first)
pnpm typecheck  # type-check the app, components, and registry sources
pnpm validate   # validate registry.json against the registry schema
pnpm lint       # lint the app and components
```

### Adding an item

The workflow: **install a core shadcn component, customize it, publish it.**

1. Install a shadcn core component locally:

   ```bash
   pnpm dlx shadcn@latest add input
   ```

2. Customize it (e.g. add a new `variant` in the `cva()` config and any new color tokens to
   `src/app/globals.css`).
3. Create an item folder at `registry/items/{name}/` containing:
   - `{name}.tsx` — the source component (imports use `@/lib/utils`).
   - `_registry.mdx` — frontmatter with `name`, `type`, `title`, `description`,
     `dependencies`, `registryDependencies` (bare `"utils"` resolves to shadcn's official
     utility), `target` (install destination, e.g. `@ui/edust-kit/{name}.tsx`), and optional
     `cssVars` (light + dark). The free-form markdown body becomes the Usage section on the
     site.
   - `_preview.tsx` — a `"use client"` component that renders the item's preview.
4. Regenerate and validate:

   ```bash
   pnpm generate
   pnpm validate
   ```

   This writes `registry.json`, the `r/` payloads used by the `@edust-kit` namespace, and
   `src/lib/registry/generated/{catalog,previews}.ts`.
5. Push to `main`. That is the deployment — the GitHub catalog and the raw namespace both
   read straight from the repository.

### Serving registry JSON locally

The docs site also serves the registry over HTTP:

```bash
curl http://localhost:3000/registry.json   # registry catalog
curl http://localhost:3000/r/button.json   # single registry item
```

Check the registry end-to-end:

```bash
npx shadcn@latest registry validate edustorg/shadcn-kit
npx shadcn@latest list edustorg/shadcn-kit
```

## Licensing

Components in this registry are from the [shadcn/ui](https://ui.shadcn.com) core library
(MIT licensed) and extended by edust-kit. Dependencies (`@base-ui/react`,
`class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss`) are permissively
licensed, so the registry can be freely reused.

This repository is licensed under the [MIT License](./LICENSE).
