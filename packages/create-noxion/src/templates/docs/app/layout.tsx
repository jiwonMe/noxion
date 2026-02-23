import type { Metadata } from "next";
import { generateNoxionListMetadata, generateWebSiteLD } from "@noxion/adapter-nextjs";
import { siteConfig } from "../lib/config";
import { ThemeScript } from "./theme-script";
import { Providers } from "./providers";
import "./globals.css";

export function generateMetadata(): Metadata {
  return generateNoxionListMetadata(siteConfig);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = generateWebSiteLD(siteConfig);

  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers siteName={siteConfig.name} author={siteConfig.author}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
