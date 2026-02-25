import type { EmptyStateProps } from "@noxion/renderer";

export function EmptyState({ title = "Nothing here yet", message = "Check back later for new content." }: EmptyStateProps) {
  return (
    <div className="">
      <h2 className="">{title}</h2>
      <p className="">{message}</p>
    </div>
  );
}
