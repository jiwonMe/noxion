import type { TagFilterProps } from "../theme/types";

export function TagFilter({ tags, selectedTags, onToggle, className }: TagFilterProps & { className?: string }) {
  if (tags.length === 0) return null;

  return (
    <div className={className ? `noxion-tag-filter ${className}` : "noxion-tag-filter"}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        const tagClass = isSelected
          ? "noxion-tag-filter__tag noxion-tag-filter__tag--selected"
          : "noxion-tag-filter__tag";
        return (
          <button key={tag} onClick={() => onToggle(tag)} type="button" className={tagClass}>
            {tag}
          </button>
        );
      })}
    </div>
  );
}
