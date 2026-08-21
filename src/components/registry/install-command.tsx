"use client";

import { useId, useState } from "react";

import { CopyButton } from "./copy-button";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const PACKAGE_MANAGERS: { value: PackageManager; label: string }[] = [
  { value: "pnpm", label: "pnpm" },
  { value: "npm", label: "npm" },
  { value: "yarn", label: "yarn" },
  { value: "bun", label: "bun" },
];

function getInstallCommand(source: string, packageManager: PackageManager): string {
  switch (packageManager) {
    case "npm":
      return `npx shadcn@latest add ${source}`;
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${source}`;
    case "yarn":
      return `yarn dlx shadcn@latest add ${source}`;
    case "bun":
      return `bunx --bun shadcn@latest add ${source}`;
  }
}

export function InstallCommand({ source }: { source: string }) {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const selectId = useId();
  const command = getInstallCommand(source, packageManager);

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex h-10 items-center justify-between gap-2 border-b px-2">
        <label
          htmlFor={selectId}
          className="sr-only"
        >
          Package manager
        </label>
        <select
          id={selectId}
          value={packageManager}
          onChange={(event) => setPackageManager(event.target.value as PackageManager)}
          className="h-7 rounded-md border-none bg-transparent px-2 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted"
        >
          {PACKAGE_MANAGERS.map((manager) => (
            <option key={manager.value} value={manager.value}>
              {manager.label}
            </option>
          ))}
        </select>
        <CopyButton text={command} />
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] text-foreground/80">
        <code>{command}</code>
      </pre>
    </div>
  );
}
