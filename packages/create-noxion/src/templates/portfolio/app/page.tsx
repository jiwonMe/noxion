import Link from "next/link";
import { getAllProjects } from "../lib/notion";

export const revalidate = 3600;

export default async function HomePage() {
  const projects = await getAllProjects();

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>
        Projects
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/${project.slug}`}
            style={{
              display: "block",
              padding: "1.5rem",
              borderRadius: "var(--noxion-border-radius, 0.5rem)",
              border: "1px solid var(--noxion-border, #e5e7eb)",
              transition: "border-color 0.2s",
            }}
          >
            {project.coverImage && (
              <img
                src={project.coverImage}
                alt={project.title}
                style={{ width: "100%", borderRadius: "0.25rem", marginBottom: "0.75rem" }}
              />
            )}
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              {project.title}
            </h3>
            {project.description && (
              <p style={{ fontSize: "0.875rem", color: "var(--noxion-mutedForeground, #737373)" }}>
                {project.description}
              </p>
            )}
            {Array.isArray(project.metadata.technologies) && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                {(project.metadata.technologies as string[]).map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                      backgroundColor: "var(--noxion-muted, #f5f5f5)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
