"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchProps } from "@noxion/renderer";
import { SearchIcon, CloseIcon } from "./Icons";

export function Search({ onSearch, placeholder = "Search posts..." }: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [value, setValue] = useState("");

  const handleInput = useCallback(
    (val: string) => {
      setValue(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(val), 200);
    },
    [onSearch],
  );

  const handleClear = useCallback(() => {
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  }, [onSearch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative w-full">
      <SearchIcon
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        className="w-full border-b-2 border-transparent bg-[var(--color-accent)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] focus:border-b-[var(--color-primary)]"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--color-muted-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:text-[var(--color-foreground)]"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
}
