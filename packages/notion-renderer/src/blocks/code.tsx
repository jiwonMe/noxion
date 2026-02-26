import { useMemo } from "react";
import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { useNotionRenderer } from "../context";
import { Text } from "../components/text";
import { cs } from "../utils";
import { normalizeLanguage } from "../shiki";

export function CodeBlock({ block }: NotionBlockProps) {
  const { highlightCode } = useNotionRenderer();

  const properties = block.properties as {
    title?: Decoration[];
    language?: Decoration[];
    caption?: Decoration[];
  } | undefined;

  const code = properties?.title
    ?.map((segment) => segment[0])
    .join("") ?? "";

  const rawLanguage = properties?.language
    ?.map((segment) => segment[0])
    .join("") ?? "plain text";

  const language = normalizeLanguage(rawLanguage);
  const displayLanguage = rawLanguage || "Plain Text";

  const highlightedHtml = useMemo(() => {
    if (!highlightCode || !code) return null;

    try {
      return highlightCode(code, rawLanguage);
    } catch {
      return null;
    }
  }, [highlightCode, code, rawLanguage]);

  return (
    <div className="noxion-code">
      <div className="noxion-code__header">
        <span className="noxion-code__language">{displayLanguage}</span>
      </div>

      {highlightedHtml ? (
        <div
          className="noxion-code__body"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="noxion-code__body">
          <code role="code" aria-label={`code block in ${displayLanguage}`} className={cs("noxion-code__content", `language-${language}`)}>
            {code}
          </code>
        </pre>
      )}

      {properties?.caption?.length ? (
        <figcaption className="noxion-code__caption">
          <Text value={properties.caption} />
        </figcaption>
      ) : null}
    </div>
  );
}
