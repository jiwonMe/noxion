"use client";

import { useState, useEffect, useCallback } from "react";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "noxion-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = resolved;
}

export function useThemePreference() {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEY) as ThemePreference) ?? "system";
  });

  const resolved = preference === "system" ? getSystemTheme() : preference;

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  useEffect(() => {
    if (preference !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(getSystemTheme());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  return { preference, resolved, setPreference } as const;
}
