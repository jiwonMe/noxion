import styles from './Showcase.module.css';

type Props = {
  tags: string[];
  activeTags: string[];
  onTagToggle: (tag: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
};

export default function ShowcaseFilters({
  tags,
  activeTags,
  onTagToggle,
  searchQuery,
  onSearchChange,
  placeholder = 'Search...',
}: Props): React.ReactElement {
  return (
    <div className={styles.filters}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className={styles.filterPills}>
        <button
          type="button"
          className={`${styles.pill} ${activeTags.length === 0 ? styles.pillActive : ''}`}
          onClick={() => {
            activeTags.forEach((t) => onTagToggle(t));
          }}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`${styles.pill} ${activeTags.includes(tag) ? styles.pillActive : ''}`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
