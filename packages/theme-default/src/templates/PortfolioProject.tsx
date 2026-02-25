"use client";

import type { NoxionTemplateProps, PortfolioCardProps } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";
import * as styles from "./PortfolioProject.css";

export function PortfolioProject({ data }: NoxionTemplateProps) {
  const recordMap = data.recordMap;
  const rootPageId = data.rootPageId as string | undefined;
  const project = data.project as PortfolioCardProps | undefined;

  if (!recordMap) {
    return <div className={styles.notFound}>Project not found.</div>;
  }

  return (
    <div className={styles.page}>
      {project && (
        <div className={styles.projectHeader}>
          {project.technologies && project.technologies.length > 0 && (
            <div className={styles.tech}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
          )}
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              className={styles.visitLink}
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
