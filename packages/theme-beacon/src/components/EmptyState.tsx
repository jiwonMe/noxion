import type { EmptyStateProps } from "@noxion/renderer";

export function EmptyState({ title = "Nothing here yet", message = "Check back later for new content." }: EmptyStateProps) {
  return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">{title}</h2>
      <p className="text-neutral-500 dark:text-neutral-500 max-w-sm mx-auto">{message}</p>
    </div>
  );
}
