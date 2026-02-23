import Link from "next/link";
import { getAllPages } from "../lib/notion";

export const revalidate = 3600;

export default async function HomePage() {
  const pages = await getAllPages();

  const sections = new Map<string, typeof pages>();
  for (const page of pages) {
    const section = (page.metadata.section as string) ?? "General";
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push(page);
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>
        Documentation
      </h1>
      {[...sections.entries()].map(([section, sectionPages]) => (
        <div key={section} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            {section}
          </h2>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {sectionPages.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/${page.slug}`}
                  style={{
                    color: "var(--noxion-primary, #2563eb)",
                    fontSize: "0.95rem",
                  }}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
