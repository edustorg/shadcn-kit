"use client";

import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

import { CopyButton } from "./copy-button";

type CodeElementProps = {
  children?: ReactNode;
  className?: string;
};

function asCodeElement(node: ReactNode): ReactElement<CodeElementProps> | null {
  return isValidElement(node) ? (node as ReactElement<CodeElementProps>) : null;
}

function extractCode(children: ReactNode): { code: string; language: string } {
  const outer = Children.only(children) as ReactElement<CodeElementProps>;
  const codeElement = asCodeElement(outer.props.children) ?? outer;
  const code = extractText(codeElement.props.children);
  const language = (codeElement.props.className ?? "").replace(/^language-/, "");

  return { code, language };
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  const element = asCodeElement(node);
  if (element) return extractText(element.props.children);
  return "";
}

export function CodeBlock({ children }: { children: ReactNode }) {
  const { code, language } = extractCode(children);

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/50">
      <div className="flex h-9 items-center justify-between border-b px-3">
        <span className="text-xs font-medium text-muted-foreground">
          {language || "code"}
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
