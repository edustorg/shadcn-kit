import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

type RegistryFile = {
  path: string;
  type: string;
  target?: string;
};

type RegistryItem = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
};

type RegistrySchema = {
  name?: string;
  homepage?: string;
  include?: string[];
  items?: RegistryItem[];
};

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors: string[] = [];
const ITEM_TYPES = new Set([
  "registry:ui",
  "registry:component",
  "registry:block",
  "registry:hook",
  "registry:lib",
  "registry:page",
  "registry:file",
  "registry:item",
  "registry:style",
  "registry:theme",
  "registry:font",
  "registry:base",
]);
const FILE_TYPES = new Set([
  "registry:ui",
  "registry:component",
  "registry:block",
  "registry:hook",
  "registry:lib",
  "registry:page",
  "registry:file",
  "registry:item",
]);

function validateItems(items: RegistryItem[] | undefined, baseDir: string) {
  if (!items) return;

  for (const item of items) {
    if (!item.name) {
      errors.push(`Item is missing a "name".`);
      continue;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name)) {
      errors.push(`Item "${item.name}" must be lowercase kebab-case.`);
    }
    if (!item.type || !ITEM_TYPES.has(item.type)) {
      errors.push(`Item "${item.name}" has an invalid or missing "type".`);
    }
    if (!item.files?.length) {
      errors.push(`Item "${item.name}" has no "files".`);
      continue;
    }

    for (const file of item.files) {
      if (!file.path) {
        errors.push(`Item "${item.name}" has a file without a "path".`);
        continue;
      }
      if (!FILE_TYPES.has(file.type)) {
        errors.push(`Item "${item.name}" file "${file.path}" has an invalid "type".`);
      }
      const fullPath = resolve(baseDir, file.path);
      if (!existsSync(fullPath)) {
        errors.push(`Item "${item.name}" references "${file.path}" which does not exist.`);
      }
    }
  }
}

function validateRegistry(schema: RegistrySchema, baseDir: string, label: string) {
  if (!schema.name) errors.push(`${label}: registry is missing a "name".`);
  if (!schema.homepage) errors.push(`${label}: registry is missing a "homepage".`);
  if (schema.include?.length) {
    for (const include of schema.include) {
      const includePath = resolve(baseDir, include);
      if (!existsSync(includePath)) {
        errors.push(`${label}: included registry "${include}" does not exist.`);
        continue;
      }
      const nested = JSON.parse(readFileSync(includePath, "utf8")) as RegistrySchema;
      validateRegistry(nested, dirname(includePath), `${label} -> ${include}`);
    }
  }
  validateItems(schema.items, baseDir);
}

const registryPath = resolve(ROOT, "registry.json");
if (!existsSync(registryPath)) {
  console.error("registry.json not found.");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(registryPath, "utf8")) as RegistrySchema;
validateRegistry(raw, ROOT, "registry.json");

if (errors.length > 0) {
  console.error(`Registry validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Registry "${raw.name}" is valid: ${raw.items?.length ?? 0} item(s).`);
