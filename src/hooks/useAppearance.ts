import { useEffect, useMemo, useState } from "react";
import {
  APPEARANCE_STORAGE_KEY,
  LEGACY_THEME_STORAGE_KEY,
  normalizeAppearance,
  type Appearance,
  type DarkThemeId,
  type LightThemeId,
  type Mode,
} from "../lib/themes";
import { useLocalStorage } from "./useLocalStorage";

function getFallbackMode(): Mode {
  const legacy = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);

  if (legacy === "light" || legacy === "dark") {
    return legacy;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Puts the choice on the <html> element, where the stylesheet picks it up.
function applyAppearance(appearance: Appearance) {
  const root = document.documentElement;

  root.classList.toggle("dark", appearance.mode === "dark");
  root.dataset.darkTheme = appearance.darkTheme;
  root.dataset.lightTheme = appearance.lightTheme;
}

export function useAppearance() {
  const [fallbackMode] = useState(getFallbackMode);
  const [stored, setStored] = useLocalStorage<unknown>(
    APPEARANCE_STORAGE_KEY,
    null,
  );

  const appearance = useMemo(
    () => normalizeAppearance(stored, fallbackMode),
    [stored, fallbackMode],
  );

  useEffect(() => {
    applyAppearance(appearance);
  }, [appearance]);

  function update(patch: Partial<Appearance>) {
    setStored({ ...appearance, ...patch });
  }

  return {
    appearance,
    mode: appearance.mode,
    setMode: (mode: Mode) => update({ mode }),
    toggleMode: () =>
      update({ mode: appearance.mode === "dark" ? "light" : "dark" }),
    // Picking a theme also switches to its mode, so you see it straight away.
    selectDarkTheme: (darkTheme: DarkThemeId) =>
      update({ darkTheme, mode: "dark" }),
    selectLightTheme: (lightTheme: LightThemeId) =>
      update({ lightTheme, mode: "light" }),
    resetThemes: () =>
      update({ darkTheme: "navy", lightTheme: "cool" }),
  };
}
