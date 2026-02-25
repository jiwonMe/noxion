"use client";

import { BlogLayout, Header, Footer } from "@noxion/theme-default";

interface SiteLayoutProps {
  siteName: string;
  author: string;
  language?: string;
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
    <BlogLayout slots={{ header: SiteHeader, footer: SiteFooter }}>
      {children}
    </BlogLayout>
  );
}
