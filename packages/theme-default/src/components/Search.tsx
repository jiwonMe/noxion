"use client";

import { useRef, useEffect, useCallback } from "react";
import type { SearchProps } from "@noxion/renderer";

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

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
    <div className="relative flex items-center w-full max-w-md">
      <span className="absolute left-3 text-gray-400 dark:text-gray-600">
        <SearchIcon />
      </span>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        className="w-full pl-10 pr-16 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
      />
      <kbd className="absolute right-3 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
        ⌘K
      </kbd>
    </div>
  );
}
