"use client";

import type { NoxionTemplateProps, PortfolioCardProps } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";

export function PortfolioProject({ data }: NoxionTemplateProps) {
  const recordMap = data.recordMap;
  const rootPageId = data.rootPageId as string | undefined;
  const project = data.project as PortfolioCardProps | undefined;

  if (!recordMap) {
    return <div className="py-12 text-center text-gray-600 dark:text-gray-400">Project not found.</div>;
  }

  return (
    <div className="space-y-8">
      {project && (
        <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              className="ml-auto inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Project ↗
            </a>
          )}
        </div>
      )}

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <NotionPage recordMap={recordMap} rootPageId={rootPageId} />
      </div>
    </div>
  );
}
