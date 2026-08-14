import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | undefined;

const LANG_MAP: Record<string, string> = {
  bash: "bash",
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  css: "css",
  html: "html",
  markup: "html",
  json: "json",
  ts: "typescript",
  typescript: "typescript",
  tsx: "tsx",
};

export async function highlightCodeToHtml(code: string, language?: string): Promise<string> {
  const lang = language ? (LANG_MAP[language.toLowerCase()] ?? "text") : "text";

  if (lang === "text") {
    return `<pre class="shiki shiki-plain" tabindex="0"><code>${escapeHtml(code)}</code></pre>`;
  }

  try {
    const highlighter = await (highlighterPromise ??= createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["typescript", "tsx", "bash", "json", "css", "html"],
    }));

    return highlighter.codeToHtml(code, {
      lang,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });
  } catch {
    return `<pre class="shiki shiki-plain" tabindex="0"><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
