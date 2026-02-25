"use client";

import { useRef, useEffect, useCallback } from "react";
import type { SearchProps } from "@noxion/renderer";

export function Search({ onSearch, placeholder = "Search posts..." }: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(value), 200);
    },
    [onSearch]
  );

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
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        className="w-full rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-neutral-500"
      />
    </div>
  );
}
