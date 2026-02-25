"use client";

import type { NoxionTemplateProps, DocsNavigationLink } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";

export function DocsPage({ data }: NoxionTemplateProps) {
  const recordMap = data.recordMap;
  const rootPageId = data.rootPageId as string | undefined;
  const prev = data.prev as DocsNavigationLink | undefined;
  const next = data.next as DocsNavigationLink | undefined;

  if (!recordMap) {
    return <div className="py-12 text-center text-gray-600 dark:text-gray-400">Page not found.</div>;
  }

  return (
    <div className="space-y-12">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <NotionPage recordMap={recordMap} rootPageId={rootPageId} />
      </div>

      {(prev || next) && (
        <nav className="flex items-center justify-between gap-4 pt-8 border-t border-gray-200 dark:border-gray-800" aria-label="Page navigation">
          <div className="flex-1">
            {prev && (
              <a 
                href={`/${prev.slug}`} 
                className="group flex flex-col gap-1 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900 transition-all"
              >
                <span className="text-sm text-gray-500 dark:text-gray-500">← Previous</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {prev.title}
                </span>
              </a>
            )}
          </div>
          <div className="flex-1 flex justify-end">
            {next && (
              <a 
                href={`/${next.slug}`} 
                className="group flex flex-col gap-1 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900 transition-all text-right"
              >
                <span className="text-sm text-gray-500 dark:text-gray-500">Next →</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {next.title}
                </span>
              </a>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
