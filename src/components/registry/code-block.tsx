import { CopyButton } from "./copy-button";
import { highlightCodeToHtml } from "@/lib/registry/highlight.server";

type CodeBlockProps = {
  code: string;
  language?: string;
  highlightedHtml?: string;
  className?: string;
};

export async function CodeBlock({ code, language, highlightedHtml, className }: CodeBlockProps) {
  const html = highlightedHtml ?? (language ? await highlightCodeToHtml(code, language) : undefined);

  return (
    <div className={`group/code-block relative min-w-0 overflow-hidden rounded-lg border bg-muted/40 ${className ?? ""}`}>
      <CopyButton
        text={code}
        className="absolute top-2 right-2 z-10 bg-muted/90 group-hover/code-block:opacity-100 sm:opacity-0"
      />
      {html ? (
        <div
          className="overflow-x-auto py-3 pl-4 pr-12 text-[13px] has-[pre[style*='--line-number-width']]:pl-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 text-sm leading-6">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
