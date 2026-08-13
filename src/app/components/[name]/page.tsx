import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InstallCommand } from "@/components/registry/install-command";
import { MdxContent } from "@/components/registry/mdx-content";
import { SourceBlock } from "@/components/registry/source-block";
import { Badge } from "@/components/ui/badge";
import { registry, getRegistryItem } from "@/lib/registry/site";
import { registryPreviews } from "@/lib/registry/generated/previews";

type ComponentPageProps = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({
  params,
}: ComponentPageProps): Promise<Metadata> {
  const { name } = await params;
  const item = getRegistryItem(name);

  return {
    title: item?.title ?? name,
    description: item?.description,
  };
}

export function generateStaticParams() {
  return registry.items.map((item) => ({ name: item.name }));
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { name } = await params;
  const item = getRegistryItem(name);

  if (!item) {
    notFound();
  }

  const Preview = item.hasPreview ? registryPreviews[item.name] : undefined;
  const source = `edustorg/shadcn-kit/${item.name}`;
  const cssVarCount = Object.values(item.cssVars ?? {}).reduce(
    (total, values) => total + Object.keys(values).length,
    0,
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
          <Badge variant="secondary">{item.type.replace("registry:", "")}</Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">{item.description}</p>
      </div>

      <section className="mt-8 grid gap-6">
        <div className="grid gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Install</h2>
          <InstallCommand source={source} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground">Dependencies</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.dependencies.length > 0 ? (
                item.dependencies.map((dependency) => (
                  <Badge key={dependency} variant="secondary">
                    {dependency}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Registry dependencies
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.registryDependencies.length > 0 ? (
                item.registryDependencies.map((dependency) => (
                  <Badge key={dependency} variant="secondary">
                    {dependency}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground">CSS variables</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">{cssVarCount} added</Badge>
              {item.cssVars ? (
                <span className="text-sm text-muted-foreground">
                  automatically merged into your theme
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {Preview ? (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Preview</h2>
          <div className="grid min-h-64 place-items-center rounded-lg border bg-background p-8">
            <Preview />
          </div>
        </section>
      ) : null}

      {item.usage ? (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Usage</h2>
          <MdxContent source={item.usage} />
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Source</h2>
        <SourceBlock sourcePath={item.sourcePath} />
      </section>
    </main>
  );
}
