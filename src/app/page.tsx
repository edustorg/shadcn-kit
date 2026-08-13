import Link from "next/link";

import { InstallCommand } from "@/components/registry/install-command";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { registry } from "@/lib/registry/site";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4">
      <section className="flex flex-col items-start gap-6 py-20">
        <Badge>edust-kit</Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          UI components for the edust platform
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {registry.description} Install any component with the shadcn CLI — it pulls the
          source, dependencies, and theme variables into your project automatically.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/components" className={buttonVariants({ variant: "default" })}>
            Browse components
          </Link>
          <Link href="/docs" className={buttonVariants({ variant: "outline" })}>
            Read the docs
          </Link>
        </div>
        <div className="mt-4 w-full max-w-xl">
          <InstallCommand source="edustorg/shadcn-kit/button" />
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
