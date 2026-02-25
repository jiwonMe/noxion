import type { Metadata } from "next";
import "@noxion/theme-default/styles/tailwind";
import "@noxion/notion-renderer/styles";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noxion Theme Dev",
  description: "Preview and develop Noxion themes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
