import { FileText } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  message = "Check back later for new content.",
  className,
}: EmptyStateProps) {
  return (
    <div className={className ? `noxion-empty-state ${className}` : "noxion-empty-state"}>
      <span className="noxion-empty-state__icon">
        <FileText size={32} strokeWidth={1.5} />
      </span>
      <h2 className="noxion-empty-state__title">{title}</h2>
      <p className="noxion-empty-state__message">{message}</p>
    </div>
  );
}
