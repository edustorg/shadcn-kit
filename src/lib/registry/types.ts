import type { ComponentType } from "react";

export type RegistryFile = {
  path: string;
  type: string;
  target?: string;
};

export type RegistryItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  cssVars?: Record<string, Record<string, string>>;
  sourcePath: string;
  hasPreview: boolean;
  usage: string;
};

export type RegistryPreviewMap = Record<string, ComponentType>;

export type RegistryCatalog = {
  name: string;
  registryName: string;
  namespace: string;
  description: string;
  homepage: string;
  repositoryUrl: string;
  items: RegistryItem[];
};
