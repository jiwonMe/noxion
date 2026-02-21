"use client";

import { NoxionThemeProvider, defaultTheme, Header, Footer } from "@noxion/renderer";

interface ProvidersProps {
  siteName: string;
  author: string;
  children: React.ReactNode;
}

export function Providers({ siteName, author, children }: ProvidersProps) {
  return (
    <NoxionThemeProvider theme={defaultTheme}>
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
            maxWidth: "var(--noxion-content-width, 720px)",
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
