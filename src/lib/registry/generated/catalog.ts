// AUTO-GENERATED. Run `pnpm generate` after adding or editing registry items.
import type { RegistryItem } from "../types";

export const registryItems: RegistryItem[] = [
  {
    "name": "badge",
    "type": "registry:ui",
    "title": "Badge",
    "description": "A badge component with shadcn variants plus custom success, warning, and info variants.",
    "dependencies": [
      "class-variance-authority",
      "@base-ui/react"
    ],
    "registryDependencies": [
      "utils"
    ],
    "cssVars": {
      "light": {
        "success": "oklch(0.723 0.187 150.5)",
        "warning": "oklch(0.769 0.188 70.08)",
        "info": "oklch(0.588 0.226 264.4)"
      },
      "dark": {
        "success": "oklch(0.775 0.196 156.7)",
        "warning": "oklch(0.833 0.194 84.6)",
        "info": "oklch(0.716 0.199 252.4)"
      }
    },
    "target": "@ui/edust-kit/badge.tsx",
    "sourcePath": "registry/items/badge/badge.tsx",
    "hasPreview": true,
    "usage": "Use the Badge to label or categorize content. It ships with the shadcn variants plus custom\n`success`, `warning`, and `info` variants.\n\n```tsx\nimport { Badge } from \"@/components/ui/edust-kit/badge\";\n\n<Badge>Default</Badge>\n<Badge variant=\"success\">Active</Badge>\n<Badge variant=\"warning\">Pending</Badge>\n<Badge variant=\"info\">New</Badge>\n```"
  },
  {
    "name": "button",
    "type": "registry:ui",
    "title": "Button",
    "description": "A button component with variants, sizes, and icons.",
    "dependencies": [
      "class-variance-authority",
      "@base-ui/react"
    ],
    "registryDependencies": [
      "utils"
    ],
    "target": "@ui/edust-kit/button.tsx",
    "sourcePath": "registry/items/button/button.tsx",
    "hasPreview": true,
    "usage": "Use the Button anywhere you need a clickable action element.\n\n```tsx\nimport { Button } from \"@/components/ui/edust-kit/button\";\n\n<Button>Default</Button>\n<Button variant=\"destructive\">Delete</Button>\n<Button size=\"sm\">Small</Button>\n```"
  }
];
