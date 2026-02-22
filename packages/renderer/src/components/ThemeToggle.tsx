"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useThemePreference, type ThemePreference } from "../hooks/useTheme";

const CYCLE: ThemePreference[] = ["system", "light", "dark"];

const LABELS: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { preference, setPreference } = useThemePreference();

  const nextPreference = () => {
    const currentIndex = CYCLE.indexOf(preference);
    const next = CYCLE[(currentIndex + 1) % CYCLE.length];
    setPreference(next);
  };

  return (
    <button
      onClick={nextPreference}
      type="button"
      aria-label={`Theme: ${LABELS[preference]}. Click to change.`}
      title={LABELS[preference]}
      className={className ? `noxion-theme-toggle ${className}` : "noxion-theme-toggle"}
    >
      {preference === "light" && <Sun size={16} strokeWidth={1.75} />}
      {preference === "dark" && <Moon size={16} strokeWidth={1.75} />}
      {preference === "system" && <Monitor size={16} strokeWidth={1.75} />}
    </button>
  );
}
