"use client";

import { useThemePreference } from "@noxion/renderer";
import type { ThemePreference, ThemeToggleProps } from "@noxion/renderer";

const CYCLE: ThemePreference[] = ["system", "light", "dark"];

const LABELS: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { preference, setPreference } = useThemePreference();

  const next = () => {
    const idx = CYCLE.indexOf(preference);
    setPreference(CYCLE[(idx + 1) % CYCLE.length]);
  };

  return (
    <button
      onClick={next}
      type="button"
      aria-label={`Theme: ${LABELS[preference]}. Click to change.`}
      title={LABELS[preference]}
      className={
        className ||
        "inline-flex h-12 w-12 items-center justify-center text-[var(--color-muted-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-hover)] hover:text-[var(--color-foreground)]"
      }
    >
      {preference === "light" && <SunIcon />}
      {preference === "dark" && <MoonIcon />}
      {preference === "system" && <MonitorIcon />}
    </button>
  );
}
