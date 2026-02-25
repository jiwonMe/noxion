"use client";

import type { EmptyStateProps } from "@noxion/renderer";

export function EmptyState({
  title = "Nothing here yet",
  message = "Check back later for new content.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h2 className="text-5xl font-semibold text-black dark:text-gray-100 mb-3">{title}</h2>
      <p className="text-base text-[#757575] dark:text-gray-500 max-w-md">{message}</p>
    </div>
  );
}
