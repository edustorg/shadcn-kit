import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getRegistryItem, registry } from "./site";

export type RegistryCatalogJson = {
  $schema: string;
  name: string;
  homepage: string;
  items: Array<{
    name: string;
    type: string;
    title?: string;
    description?: string;
    dependencies?: string[];
    registryDependencies?: string[];
    cssVars?: Record<string, Record<string, string>>;
    files: Array<{ path: string; type: string }>;
  }>;
};

export function getRegistryCatalogJson(): RegistryCatalogJson {
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: registry.registryName,
    homepage: registry.homepage,
    items: registry.items.map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      ...(item.dependencies.length ? { dependencies: item.dependencies } : {}),
      ...(item.registryDependencies.length
        ? { registryDependencies: item.registryDependencies }
        : {}),
      ...(item.cssVars ? { cssVars: item.cssVars } : {}),
      files:
        item.files?.length
          ? item.files.map((f) => ({ path: f.path, type: f.type }))
          : [{ path: item.sourcePath, type: item.type }],
    })),
  };
}

export type RegistryItemJson = ReturnType<typeof getRegistryItemJson>;

export function getRegistryItemJson(name: string) {
  const item = getRegistryItem(name);

  if (!item) {
    return null;
  }

  const files =
    item.files?.length
      ? item.files.map((file) => {
          const sourcePath = file.path.replace(/^registry\//, "");
          return {
            path: file.path,
            content: readFileSync(join(process.cwd(), "registry", sourcePath), "utf8"),
            type: file.type,
            target: file.target,
          };
        })
      : [
          {
            path: item.sourcePath,
            content: readFileSync(
              join(process.cwd(), "registry", item.sourcePath.replace(/^registry\//, "")),
              "utf8",
            ),
            type: item.type,
            target: item.target,
          },
        ];

  return {
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
    files,
  };
}
