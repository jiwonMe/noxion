import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NotionPage } from "@noxion/renderer";
import { generateNoxionMetadata, generateBlogPostingLD } from "@noxion/adapter-nextjs";
import { getPageBySlug, getPageRecordMap, getAllPages } from "../../lib/notion";
import { siteConfig } from "../../lib/config";

export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Not Found" };
  return generateNoxionMetadata(page, siteConfig);
}

export default async function PageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const recordMap = await getPageRecordMap(page.id);

  return (
    <article>
      {page.pageType === "blog" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBlogPostingLD(page, siteConfig)) }}
        />
      )}
      <NotionPage
        recordMap={recordMap}
        rootPageId={page.id}
        fullPage
        previewImages
        showTableOfContents={page.pageType !== "portfolio"}
        mapPageUrl={(pageId: string) => `/${pageId}`}
      />
    </article>
  );
}
