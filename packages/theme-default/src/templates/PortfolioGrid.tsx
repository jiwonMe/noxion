"use client";

import type { NoxionTemplateProps, PortfolioCardProps } from "@noxion/renderer";
import { PortfolioProjectCard } from "../components/PortfolioProjectCard";

export function PortfolioGrid({ data }: NoxionTemplateProps) {
  const projects = (data.projects ?? []) as PortfolioCardProps[];

  if (projects.length === 0) {
    return <div className="">No projects found.</div>;
  }

  return (
    <div className="">
      <div className="">
        {projects.map((project) => (
          <PortfolioProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}
