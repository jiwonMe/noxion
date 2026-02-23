import type { NoxionTemplateProps, PortfolioCardProps } from "../theme/types";
import { PortfolioProjectCard } from "../components/PortfolioProjectCard";

export function PortfolioGrid({ data, className }: NoxionTemplateProps) {
  const projects = (data.projects ?? []) as PortfolioCardProps[];

  if (projects.length === 0) {
    return (
      <div className="noxion-empty-state">
        <p className="noxion-empty-state__message">No projects found.</p>
      </div>
    );
  }

  return (
    <div className={className ? `noxion-template-portfolio-grid ${className}` : "noxion-template-portfolio-grid"}>
      <div className="noxion-portfolio-grid">
        {projects.map((project) => (
          <PortfolioProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}
