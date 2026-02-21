export function InlineEquation({ expression }: { expression: string }) {
  try {
    const katex = require("katex");
    const html = katex.renderToString(expression, {
      displayMode: false,
      throwOnError: false,
    });
    return (
      <span
        className="noxion-equation noxion-equation--inline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <code className="noxion-equation-error">{expression}</code>;
  }
}
