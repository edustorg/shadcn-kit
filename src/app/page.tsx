import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { registry } from "@/lib/registry/site";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4">
      <section className="flex flex-col items-start gap-6 py-20">
        <Badge>shadcn-compatible registry</Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {registry.name}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {registry.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/components" className={buttonVariants({ variant: "default" })}>
            Browse components
          </Link>
          <Link href="/docs" className={buttonVariants({ variant: "outline" })}>
            Read the docs
          </Link>
        </div>
        <div className="mt-4 w-full max-w-xl overflow-hidden rounded-lg border bg-muted/50">
          <div className="flex h-9 items-center justify-between border-b px-3">
            <span className="text-xs font-medium text-muted-foreground">Install</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-6">
            <code>npx shadcn@latest add edustorg/shadcn-kit/button</code>
          </pre>
        </div>
      </section>

      <section className="grid gap-4 pb-20 sm:grid-cols-2">
        {registry.items.map((item) => (
          <Link
            key={item.name}
            href={`/components/${item.name}`}
            className="group flex flex-col gap-2 rounded-lg border p-6 transition-colors hover:bg-muted/50"
          >
            <span className="font-semibold">{item.title}</span>
            <span className="text-sm text-muted-foreground">{item.description}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
