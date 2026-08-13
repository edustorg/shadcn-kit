import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "./code-block";

export const mdxComponents: MDXComponents = {
  pre: (props) => <CodeBlock {...props} />,
  h1: (props) => <h1 className="mb-4 mt-8 text-3xl font-semibold tracking-tight" {...props} />,
  h2: (props) => <h2 className="mb-3 mt-8 text-xl font-semibold tracking-tight" {...props} />,
  h3: (props) => <h3 className="mb-2 mt-6 text-lg font-semibold tracking-tight" {...props} />,
  p: (props) => <p className="my-4 leading-7 text-muted-foreground" {...props} />,
  a: (props) => (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props) => <ul className="my-4 list-disc space-y-1 pl-6" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-1 pl-6" {...props} />,
  code: (props) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b px-4 py-2 text-left font-medium" {...props} />,
  td: (props) => <td className="border-b px-4 py-2 align-top" {...props} />,
};
