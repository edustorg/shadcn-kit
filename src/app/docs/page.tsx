import Link from "next/link";

import { getDocs } from "@/lib/registry/site";

export const metadata = {
  title: "Docs",
  description: "Documentation for this registry.",
};

export default function DocsPage() {
  const docs = getDocs();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Docs</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="flex flex-col gap-2 rounded-lg border p-6 transition-colors hover:bg-muted/50"
          >
            <span className="font-semibold">{doc.title}</span>
            <span className="text-sm text-muted-foreground">{doc.description}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
