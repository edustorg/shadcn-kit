import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CopyButton } from "./copy-button";

export function SourceBlock({ sourcePath }: { sourcePath: string }) {
  const relativePath = sourcePath.replace(/^registry\//, "");
  const source = readFileSync(join(process.cwd(), "registry", relativePath), "utf8");

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/50">
      <div className="flex h-9 items-center justify-between border-b px-3">
        <span className="text-xs font-medium text-muted-foreground">{sourcePath}</span>
        <CopyButton text={source} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code>{source}</code>
      </pre>
    </div>
  );
}
