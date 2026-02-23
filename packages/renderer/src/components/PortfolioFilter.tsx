"use client";

import { useState } from "react";
import type { PortfolioFilterProps } from "../theme/types";

export function PortfolioFilter({
  technologies,
  selectedTechnologies,
  onToggle,
  className,
}: PortfolioFilterProps & { className?: string }) {
  const [expanded, setExpanded] = useState(false);

  if (technologies.length === 0) return null;

  const maxVisible = 8;
  const shouldCollapse = technologies.length > maxVisible;
  const visibleTechs = shouldCollapse && !expanded ? technologies.slice(0, maxVisible) : technologies;
  const hiddenCount = shouldCollapse ? technologies.length - maxVisible : 0;

  return (
    <div className={className ? `noxion-portfolio-filter ${className}` : "noxion-portfolio-filter"}>
      {visibleTechs.map((tech) => {
        const isSelected = selectedTechnologies.includes(tech);
        const tagClass = isSelected
          ? "noxion-portfolio-filter__tag noxion-portfolio-filter__tag--selected"
          : "noxion-portfolio-filter__tag";
        return (
          <button key={tech} onClick={() => onToggle(tech)} type="button" className={tagClass}>
            {tech}
          </button>
        );
      })}

      {shouldCollapse && !expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="noxion-portfolio-filter__tag noxion-portfolio-filter__tag--more"
        >
          +{hiddenCount}
        </button>
      )}

      {shouldCollapse && expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="noxion-portfolio-filter__tag noxion-portfolio-filter__tag--more"
        >
          Show less
        </button>
      )}
    </div>
  );
}
