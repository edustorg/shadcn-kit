import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/registry/mdx-content";
import { getDoc, getDocs } from "@/lib/registry/site";

type DocPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);

  return {
    title: doc?.title ?? slug,
    description: doc?.description,
  };
}

export function generateStaticParams() {
  return getDocs().map((doc) => ({ slug: doc.slug }));
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDoc(slug);

  if (!doc) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{doc.title}</h1>
      {doc.description ? (
        <p className="mt-2 text-muted-foreground">{doc.description}</p>
      ) : null}
      <div className="mt-8">
        <MdxContent source={doc.content} />
      </div>
    </main>
  );
}
