"use client";

import { NoxionThemeProvider, Header, Footer, BlogLayout } from "@noxion/renderer";
import { themeDefault } from "@noxion/theme-default";

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
    <NoxionThemeProvider
      themePackage={themeDefault}
      slots={{
        header: SiteHeader,
        footer: SiteFooter,
      }}
    >
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
