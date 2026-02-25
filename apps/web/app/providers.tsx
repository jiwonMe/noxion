"use client";

import { NoxionThemeProvider } from "@noxion/renderer";
import { defaultThemeContract, Header, Footer, BlogLayout } from "@noxion/theme-default";

interface ProvidersProps {
  siteName: string;
  author: string;
  children: React.ReactNode;
}

export function Providers({ siteName, author, children }: ProvidersProps) {
  const SiteHeader = () => (
    <Header
      siteName={siteName}
      navigation={[{ label: "Home", href: "/" }]}
    />
  );

  const SiteFooter = () => (
    <Footer siteName={siteName} author={author} />
  );

  return (
    <NoxionThemeProvider themeContract={defaultThemeContract}>
      <BlogLayout
        slots={{
          header: SiteHeader,
          footer: SiteFooter,
        }}
      >
        {children}
      </BlogLayout>
    </NoxionThemeProvider>
  );
}
