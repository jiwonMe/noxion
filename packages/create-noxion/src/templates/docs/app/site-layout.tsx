"use client";

import { DocsLayout, Header, Footer } from "@noxion/theme-default";

interface SiteLayoutProps {
  siteName: string;
  author: string;
  children: React.ReactNode;
}

export function SiteLayout({ siteName, author, children }: SiteLayoutProps) {
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
    <DocsLayout slots={{ header: SiteHeader, footer: SiteFooter }}>
      {children}
    </DocsLayout>
  );
}
