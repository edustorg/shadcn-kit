import { readdirSync, readFileSync } from "node:fs";
import { join, basename, extname } from "node:path";
import matter from "gray-matter";

import { registryConfig } from "../../../registry/config";
import { registryItems } from "./generated/catalog";
import type { RegistryCatalog, RegistryItem } from "./types";

export const registry: RegistryCatalog = {
  ...registryConfig,
  items: registryItems,
};

export function getRegistryItem(name: string): RegistryItem | undefined {
  return registryItems.find((item) => item.name === name);
}

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  content: string;
};

const DOCS_DIR = join(process.cwd(), "registry/docs");

export function getDocs(): DocPage[] {
  const pages = readdirSync(DOCS_DIR, { encoding: "utf8" })
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(readFileSync(join(DOCS_DIR, file), "utf8"));
      return {
        slug: basename(file, extname(file)),
        title: (data.title as string) ?? basename(file, extname(file)),
        description: (data.description as string) ?? "",
        order: (data.order as number) ?? 99,
        content: content.trim(),
      };
    })
    .sort((a, b) => a.order - b.order);

  return pages;
}

export function getDoc(slug: string): DocPage | undefined {
  return getDocs().find((page) => page.slug === slug);
}
