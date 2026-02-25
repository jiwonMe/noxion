import type { EmptyStateProps } from "@noxion/renderer";
import * as styles from "./EmptyState.css";

export function EmptyState({ title = "Nothing here yet", message = "Check back later for new content." }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
