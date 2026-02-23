import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NotionPage } from "@noxion/renderer";
import { generateNoxionMetadata } from "@noxion/adapter-nextjs";
import { getProjectBySlug, getPageRecordMap, getAllProjects } from "../../lib/notion";
import { siteConfig } from "../../lib/config";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  return generateNoxionMetadata(project, siteConfig);
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const recordMap = await getPageRecordMap(project.id);

  return (
    <article>
      <NotionPage
        recordMap={recordMap}
        rootPageId={project.id}
        fullPage
        previewImages
        mapPageUrl={(pageId: string) => `/${pageId}`}
      />
    </article>
  );
}
