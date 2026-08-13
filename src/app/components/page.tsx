import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { registry } from "@/lib/registry/site";

export const metadata = {
  title: "Components",
  description: "Browse all components in this registry.",
};

export default function ComponentsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
      <p className="mt-2 text-muted-foreground">
        Installable items built from the shadcn core library.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {registry.items.map((item) => (
          <Link
            key={item.name}
            href={`/components/${item.name}`}
            className="group flex flex-col gap-2 rounded-lg border p-6 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{item.title}</span>
              <Badge variant="secondary">{item.type.replace("registry:", "")}</Badge>
            </div>
            <span className="text-sm text-muted-foreground">{item.description}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
