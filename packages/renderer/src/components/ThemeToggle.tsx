import { useThemePreference, type ThemePreference } from "../hooks/useTheme";

const ICONS: Record<ThemePreference, string> = {
  light: "\u2600\uFE0F",
  dark: "\uD83C\uDF19",
  system: "\uD83D\uDCBB",
};

const LABELS: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const CYCLE: ThemePreference[] = ["system", "light", "dark"];

export function ThemeToggle() {
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
      className="noxion-theme-toggle"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2rem",
        height: "2rem",
        borderRadius: "var(--noxion-border-radius, 0.5rem)",
        border: "1px solid var(--noxion-border, #e5e5e5)",
        backgroundColor: "transparent",
        cursor: "pointer",
        fontSize: "1rem",
      }}
    >
      {ICONS[preference]}
    </button>
  );
}
