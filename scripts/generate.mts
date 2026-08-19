import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { registryConfig } from "../registry/config.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ITEMS_DIR = resolve(ROOT, "registry/items");
const GENERATED_DIR = resolve(ROOT, "src/lib/registry/generated");

type RegistryFile = {
  path: string;
  type: string;
  target?: string;
};

type ItemFrontmatter = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  cssVars?: Record<string, Record<string, string>>;
  target?: string;
};

type RegistryItem = ItemFrontmatter & {
  sourcePath: string;
  files: RegistryFile[];
  hasPreview: boolean;
  usage: string;
  dependencies: string[];
  registryDependencies: string[];
  target: string;
};

function findRegistryMdxFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { recursive: true, encoding: "utf8" })) {
    if (entry.endsWith("_registry.mdx")) {
      files.push(resolve(dir, entry));
    }
  }
  return files;
}

function toRepoPath(filePath: string): string {
  return relative(ROOT, filePath).split("\\").join("/");
}

const items: RegistryItem[] = findRegistryMdxFiles(ITEMS_DIR).map((mdxPath) => {
  const { data, content } = matter(readFileSync(mdxPath, "utf8"));
  const meta = data as Partial<ItemFrontmatter>;
  const itemDir = dirname(mdxPath);
  const name = meta.name ?? dirname(mdxPath).split("/").pop()!;
  const type = meta.type ?? "registry:ui";
  const hasPreview = readdirSync(itemDir, { encoding: "utf8" }).includes("_preview.tsx");

  let files: RegistryFile[];
  if (meta.files && meta.files.length > 0) {
    files = meta.files.map((file) => ({
      path: toRepoPath(resolve(itemDir, file.path)),
      type: file.type,
      target: file.target,
    }));
  } else {
    const sourcePath = toRepoPath(resolve(itemDir, `${name}.tsx`));
    const target = meta.target ?? `@ui/edust-kit/${name}.tsx`;
    files = [{ path: sourcePath, type, target }];
  }

  return {
    name,
    type,
    title: meta.title ?? name,
    description: meta.description ?? "",
    dependencies: meta.dependencies ?? [],
    registryDependencies: meta.registryDependencies ?? [],
    files,
    cssVars: meta.cssVars,
    target: files[0]?.target ?? `@ui/edust-kit/${name}.tsx`,
    sourcePath: files[0]?.path ?? `${name}.tsx`,
    hasPreview,
    usage: content.trim(),
  };
});

items.sort((a, b) => a.name.localeCompare(b.name));

function renderJsonString(value: string): string {
  return JSON.stringify(value);
}

const catalog = items.map((item) => ({
  name: item.name,
  type: item.type,
  title: item.title,
  description: item.description,
  dependencies: item.dependencies,
  registryDependencies: item.registryDependencies,
  cssVars: item.cssVars,
  target: item.target,
  sourcePath: item.sourcePath,
  files: item.files,
  hasPreview: item.hasPreview,
  usage: item.usage,
}));

mkdirSync(GENERATED_DIR, { recursive: true });

writeFileSync(
  resolve(GENERATED_DIR, "catalog.ts"),
  `// AUTO-GENERATED. Run \`pnpm generate\` after adding or editing registry items.
import type { RegistryItem } from "../types";

export const registryItems: RegistryItem[] = ${JSON.stringify(catalog, null, 2)};
`,
);

const previews = items.filter((item) => item.hasPreview);
const previewLines = previews.map((item) => {
  const name = item.name
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^([a-z])/, (c) => c.toUpperCase());
  const previewPath = resolve(
    ROOT,
    "registry/items",
    item.sourcePath.replace(/^registry\/items\//, "").replace(/\/[^/]+$/, ""),
    "_preview",
  );
  const importPath = relative(GENERATED_DIR, previewPath);
  return `import { Preview as Preview${name} } from ${renderJsonString(importPath)};`;
});

writeFileSync(
  resolve(GENERATED_DIR, "previews.ts"),
  `// AUTO-GENERATED. Run \`pnpm generate\` after adding or editing registry items.
${previewLines.join("\n")}

import type { RegistryPreviewMap } from "../types";

export const registryPreviews: RegistryPreviewMap = {
${previews.map((item) => {
  const name = item.name
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^([a-z])/, (c) => c.toUpperCase());
  return `  ${renderJsonString(item.name)}: Preview${name},`;
}).join("\n")}
};
`,
);

const registryJson = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: registryConfig.registryName,
  homepage: registryConfig.homepage,
  items: items.map((item) => ({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    ...(item.dependencies.length ? { dependencies: item.dependencies } : {}),
    ...(item.registryDependencies.length
      ? { registryDependencies: item.registryDependencies }
      : {}),
    ...(item.cssVars ? { cssVars: item.cssVars } : {}),
    files: item.files.map((f) => ({ path: f.path, type: f.type, target: f.target })),
  })),
};

writeFileSync(
  resolve(ROOT, "registry.json"),
  `${JSON.stringify(registryJson, null, 2)}\n`,
);

const R_DIR = resolve(ROOT, "r");
mkdirSync(R_DIR, { recursive: true });

writeFileSync(
  resolve(R_DIR, "registry.json"),
  `${JSON.stringify(registryJson, null, 2)}\n`,
);

for (const item of items) {
  const itemFiles = item.files.map((file) => ({
    path: file.path,
    content: readFileSync(resolve(ROOT, file.path), "utf8"),
    type: file.type,
    target: file.target,
  }));

  const itemJson = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    ...(item.dependencies.length ? { dependencies: item.dependencies } : {}),
    ...(item.registryDependencies.length
      ? { registryDependencies: item.registryDependencies }
      : {}),
    ...(item.cssVars ? { cssVars: item.cssVars } : {}),
    files: itemFiles,
  };
  writeFileSync(resolve(R_DIR, `${item.name}.json`), `${JSON.stringify(itemJson, null, 2)}\n`);
}

console.log(`Generated catalog: ${items.length} item(s)`);
console.log(`Generated previews: ${previews.length} preview(s)`);
console.log(
  "Written registry.json, r/registry.json, r/{name}.json, src/lib/registry/generated/catalog.ts, src/lib/registry/generated/previews.ts",
);
