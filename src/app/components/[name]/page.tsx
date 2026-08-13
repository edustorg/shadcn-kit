import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/registry/copy-button";
import { MdxContent } from "@/components/registry/mdx-content";
import { SourceBlock } from "@/components/registry/source-block";
import { Badge } from "@/components/ui/badge";
import { getRegistryItem, registry } from "@/lib/registry/site";
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
  const installCommand = `npx shadcn@latest add edustorg/shadcn-kit/${item.name}`;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
          <Badge variant="secondary">{item.type.replace("registry:", "")}</Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">{item.description}</p>
      </div>

      <div className="mt-8 grid items-start gap-2 sm:grid-cols-[1fr_auto]">
        <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm leading-6">
          <code>{installCommand}</code>
        </pre>
        <CopyButton text={installCommand} />
      </div>

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
