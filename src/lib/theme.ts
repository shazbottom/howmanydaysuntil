export type ThemePreference = "light" | "dark";

export const THEME_STORAGE_KEY = "daysuntil_theme";

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark";
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemePreference(storedValue) ? storedValue : "light";
}

export function getResolvedTheme(preference: ThemePreference): "light" | "dark" {
  return preference === "dark" ? "dark" : "light";
}

export function applyThemePreference(preference: ThemePreference): void {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = getResolvedTheme(preference);
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolvedTheme;
}

export function persistThemePreference(preference: ThemePreference): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
}
