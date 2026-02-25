"use client";

import { NoxionThemeProvider } from "@noxion/renderer";
import { defaultThemeContract, Header, Footer } from "@noxion/theme-default";

interface ProvidersProps {
  siteName: string;
  author: string;
  children: React.ReactNode;
}

export function Providers({ siteName, author, children }: ProvidersProps) {
  return (
    <NoxionThemeProvider themeContract={defaultThemeContract}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header
          siteName={siteName}
          navigation={[
            { label: "Home", href: "/" },
          ]}
        />
        <main
          style={{
            flex: 1,
            width: "100%",
            maxWidth: "var(--color-content, 720px)",
            margin: "0 auto",
            padding: "2rem 1.5rem",
          }}
        >
          {children}
        </main>
        <Footer
          siteName={siteName}
          author={author}
        />
      </div>
    </NoxionThemeProvider>
  );
}
