<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Registry Items

## Install path convention

Target path in `_registry.mdx` must use `@ui/edust-kit/` prefix:

```yaml
target: "@ui/edust-kit/<component-name>.tsx"
```

This installs to `src/components/edust-kit/<component-name>.tsx` in the consumer's project.

**Wrong** — creates `src/@/components/...` literally:
```yaml
target: "@/components/async-select-field/async-select-field.tsx"
```

**Correct** — installs to `src/components/edust-kit/async-select-field.tsx`:
```yaml
target: "@ui/edust-kit/async-select-field.tsx"
```

No `index.ts` barrel export needed. Consumers import directly:
```tsx
import { AsyncSelectField } from "@/components/edust-kit/async-select-field"
```
