import { MDXRemote } from "next-mdx-remote/rsc";

import { mdxComponents } from "./mdx-components";

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="max-w-none">
      <MDXRemote source={source} components={mdxComponents} />
    </div>
  );
}
