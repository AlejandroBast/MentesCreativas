import { useCallback, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const hasWindow = () => typeof window !== "undefined";

const readStoredTheme = (): Theme | null => {
  if (!hasWindow()) return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return null;
};

const getPreferredTheme = (): Theme => {
  if (!hasWindow()) return "light";
  const matches = window.matchMedia(MEDIA_QUERY).matches;
  return matches ? "dark" : "light";
};

const applyTheme = (theme: Theme) => {
  if (!hasWindow()) return;
  const root = document.documentElement;
  if (!root) return;
  root.classList.toggle("dark", theme === "dark");
  if (root.dataset) {
    root.dataset.theme = theme;
  } else if (typeof root.setAttribute === "function") {
    root.setAttribute("data-theme", theme);
  }
};

const dispatchThemeEvent = (theme: Theme) => {
  if (!hasWindow()) return;
  window.dispatchEvent(new CustomEvent("theme:changed", { detail: { theme } }));
};

export function useTheme() {
  const storedTheme = useMemo(() => readStoredTheme(), []);
  const [theme, setTheme] = useState<Theme>(storedTheme ?? getPreferredTheme());
  const [hasOverride, setHasOverride] = useState(storedTheme !== null);

  useEffect(() => {
    applyTheme(theme);
    if (!hasWindow()) return;
    window.localStorage.setItem(STORAGE_KEY, theme);
    dispatchThemeEvent(theme);
  }, [theme]);

  useEffect(() => {
    if (!hasWindow() || hasOverride) return undefined;
    const media = window.matchMedia(MEDIA_QUERY);
    const update = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener
      ? media.addEventListener("change", update)
      : media.addListener(update);

    return () => {
      media.removeEventListener
        ? media.removeEventListener("change", update)
        : media.removeListener(update);
    };
  }, [hasOverride]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    setHasOverride(true);
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
  };
}
