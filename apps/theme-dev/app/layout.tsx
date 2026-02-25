import type { Metadata } from "next";
import "./tailwind.css";
import "@noxion/notion-renderer/styles";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noxion Theme Dev",
  description: "Preview and develop Noxion themes",
};

function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('noxion-theme');
        var theme = stored || 'system';
        if (theme === 'system') {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.dataset.theme = theme;
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
