"use client";

import type { NoxionTemplateProps, PortfolioCardProps } from "@noxion/renderer";
import { PortfolioProjectCard } from "../components/PortfolioProjectCard";
import * as styles from "./PortfolioGrid.css";

export function PortfolioGrid({ data }: NoxionTemplateProps) {
  const projects = (data.projects ?? []) as PortfolioCardProps[];

  if (projects.length === 0) {
    return <div className={styles.empty}>No projects found.</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {projects.map((project) => (
          <PortfolioProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}
