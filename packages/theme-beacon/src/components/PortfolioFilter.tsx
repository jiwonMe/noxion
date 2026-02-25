"use client";

import { useState } from "react";
import type { PortfolioFilterProps } from "@noxion/renderer";

const MAX_VISIBLE = 8;

export function PortfolioFilter({ technologies, selectedTechnologies, onToggle }: PortfolioFilterProps) {
  const [expanded, setExpanded] = useState(false);

  if (technologies.length === 0) return null;

  const shouldCollapse = technologies.length > MAX_VISIBLE;
  const visible = shouldCollapse && !expanded ? technologies.slice(0, MAX_VISIBLE) : technologies;
  const hiddenCount = shouldCollapse ? technologies.length - MAX_VISIBLE : 0;

  return (
    <div className="">
      {visible.map((tech) => {
        const isSelected = selectedTechnologies.includes(tech);
        return (
          <button
            key={tech}
            onClick={() => onToggle(tech)}
            type="button"
            className={isSelected ? "" : ""}
          >
            {tech}
          </button>
        );
      })}

      {shouldCollapse && !expanded && hiddenCount > 0 && (
        <button type="button" onClick={() => setExpanded(true)} className="">
          +{hiddenCount}
        </button>
      )}

      {shouldCollapse && expanded && (
        <button type="button" onClick={() => setExpanded(false)} className="">
          Show less
        </button>
      )}
    </div>
  );
}
