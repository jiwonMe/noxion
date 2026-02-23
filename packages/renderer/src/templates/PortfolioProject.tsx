import type { NoxionTemplateProps, PortfolioCardProps } from "../theme/types";
import { NotionPage } from "../components/NotionPage";
import type { ExtendedRecordMap } from "notion-types";

export function PortfolioProject({ data, className }: NoxionTemplateProps) {
  const recordMap = data.recordMap as ExtendedRecordMap | undefined;
  const rootPageId = data.rootPageId as string | undefined;
  const project = data.project as PortfolioCardProps | undefined;

  if (!recordMap) {
    return (
      <div className="noxion-empty-state">
        <p className="noxion-empty-state__message">Project not found.</p>
      </div>
    );
  }

  return (
    <div className={className ? `noxion-template-portfolio-project ${className}` : "noxion-template-portfolio-project"}>
      {project && (
        <div className="noxion-portfolio-project__header">
          {project.technologies && project.technologies.length > 0 && (
            <div className="noxion-portfolio-project__tech">
              {project.technologies.map((tech) => (
                <span key={tech} className="noxion-portfolio-project__tech-tag">{tech}</span>
              ))}
            </div>
          )}
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              className="noxion-portfolio-project__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Project
            </a>
          )}
        </div>
      )}

      <NotionPage recordMap={recordMap} rootPageId={rootPageId} />
    </div>
  );
}
