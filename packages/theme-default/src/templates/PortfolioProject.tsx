"use client";

import type { NoxionTemplateProps, PortfolioCardProps } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";

export function PortfolioProject({ data }: NoxionTemplateProps) {
  const recordMap = data.recordMap;
  const rootPageId = data.rootPageId as string | undefined;
  const project = data.project as PortfolioCardProps | undefined;

  if (!recordMap) {
    return <div className="">Project not found.</div>;
  }

  return (
    <div className="">
      {project && (
        <div className="">
          {project.technologies && project.technologies.length > 0 && (
            <div className="">
              {project.technologies.map((tech) => (
                <span key={tech} className="">{tech}</span>
              ))}
            </div>
          )}
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              className=""
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Project ↗
            </a>
          )}
        </div>
      )}

      <NotionPage recordMap={recordMap} rootPageId={rootPageId} />
    </div>
  );
}
