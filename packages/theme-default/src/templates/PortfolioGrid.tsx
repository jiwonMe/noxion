"use client";

import type { NoxionTemplateProps, PortfolioCardProps } from "@noxion/renderer";
import { PortfolioProjectCard } from "../components/PortfolioProjectCard";

export function PortfolioGrid({ data }: NoxionTemplateProps) {
  const projects = (data.projects ?? []) as PortfolioCardProps[];

  if (projects.length === 0) {
    return <div className="py-12 text-center text-gray-600 dark:text-gray-400">No projects found.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <PortfolioProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}
