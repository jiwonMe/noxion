import type { HighlightCodeFn } from "./types";

const NOTION_TO_SHIKI_LANG: Record<string, string> = {
  "abap": "abap",
  "arduino": "arduino",
  "bash": "bash",
  "basic": "basic",
  "c": "c",
  "clojure": "clojure",
  "coffeescript": "coffeescript",
  "c++": "cpp",
  "c#": "csharp",
  "css": "css",
  "dart": "dart",
  "diff": "diff",
  "docker": "docker",
  "elixir": "elixir",
  "elm": "elm",
  "erlang": "erlang",
  "flow": "javascript",
  "fortran": "fortran-free-form",
  "f#": "fsharp",
  "gherkin": "gherkin",
  "glsl": "glsl",
  "go": "go",
  "graphql": "graphql",
  "groovy": "groovy",
  "haskell": "haskell",
  "html": "html",
  "java": "java",
  "javascript": "javascript",
  "json": "json",
  "julia": "julia",
  "kotlin": "kotlin",
  "latex": "latex",
  "less": "less",
  "lisp": "lisp",
  "livescript": "javascript",
  "lua": "lua",
  "makefile": "makefile",
  "markdown": "markdown",
  "markup": "html",
  "matlab": "matlab",
  "mermaid": "mermaid",
  "nix": "nix",
  "objective-c": "objective-c",
  "ocaml": "ocaml",
  "pascal": "pascal",
  "perl": "perl",
  "php": "php",
  "plain text": "text",
  "powershell": "powershell",
  "prolog": "prolog",
  "protobuf": "proto",
  "python": "python",
  "r": "r",
  "reason": "javascript",
  "ruby": "ruby",
  "rust": "rust",
  "sass": "sass",
  "scala": "scala",
  "scheme": "scheme",
  "scss": "scss",
  "shell": "shellscript",
  "sql": "sql",
  "swift": "swift",
  "toml": "toml",
  "typescript": "typescript",
  "vb.net": "vb",
  "verilog": "verilog",
  "vhdl": "vhdl",
  "visual basic": "vb",
  "webassembly": "wasm",
  "xml": "xml",
  "yaml": "yaml",
  "java/c/c++/c#": "java",
  "jsx": "jsx",
  "tsx": "tsx",
};

export function normalizeLanguage(notionLanguage: string): string {
  const lower = notionLanguage.toLowerCase().trim();
  return NOTION_TO_SHIKI_LANG[lower] ?? lower;
}

const DEFAULT_LANGS = [
  "bash",
  "c",
  "cpp",
  "csharp",
  "css",
  "dart",
  "diff",
  "docker",
  "go",
  "graphql",
  "html",
  "java",
  "javascript",
  "json",
  "jsx",
  "kotlin",
  "latex",
  "lua",
  "makefile",
  "markdown",
  "objective-c",
  "perl",
  "php",
  "python",
  "r",
  "ruby",
  "rust",
  "sass",
  "scala",
  "scss",
  "shellscript",
  "sql",
  "swift",
  "toml",
  "tsx",
  "typescript",
  "xml",
  "yaml",
];

export async function createShikiHighlighter(
  options: {
    theme?: string;
    darkTheme?: string;
    langs?: string[];
  } = {}
): Promise<HighlightCodeFn> {
  const { createHighlighter } = await import("shiki");

  const theme = options.theme ?? "github-light";
  const darkTheme = options.darkTheme ?? "github-dark";
  const langs = options.langs ?? DEFAULT_LANGS;

  const highlighter = await createHighlighter({
    themes: [theme, darkTheme],
    langs,
  });

  return (code: string, language: string) => {
    const lang = normalizeLanguage(language);

    try {
      const loadedLangs = highlighter.getLoadedLanguages();
      if (!loadedLangs.includes(lang as never)) {
        return escapeHtml(code);
      }

      return highlighter.codeToHtml(code, {
        lang,
        themes: {
          light: theme,
          dark: darkTheme,
        },
      });
    } catch {
      return escapeHtml(code);
    }
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
