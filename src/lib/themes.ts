export type Mode = "light" | "dark";

// The colours a preview card shows. They mirror what the theme really uses.
export type ThemeSwatch = {
  page: string;
  panel: string;
  row: string;
  border: string;
  text: string;
  muted: string;
  button: string;
  link: string;
};

export type ThemeOption = {
  id: string;
  name: string;
  description: string;
  swatch: ThemeSwatch;
};

export const DARK_THEMES = [
  {
    id: "navy",
    name: "Navy",
    description: "The original deep navy with a sky-blue accent",
    swatch: {
      page: "#020617",
      panel: "#0f172a",
      row: "#020617",
      border: "#1e293b",
      text: "#f1f5f9",
      muted: "#94a3b8",
      button: "#0284c7",
      link: "#38bdf8",
    },
  },
  {
    id: "tokyo",
    name: "Tokyo Night",
    description: "Deep blue with a soft blue accent",
    swatch: {
      page: "#16161e",
      panel: "#1f2335",
      row: "#16161e",
      border: "#292e42",
      text: "#cdd6fa",
      muted: "#8d99c6",
      button: "#3d59a1",
      link: "#7aa2f7",
    },
  },
  {
    id: "mocha",
    name: "Catppuccin Mocha",
    description: "Warm dark with a soft mauve accent",
    swatch: {
      page: "#11111b",
      panel: "#1e1e2e",
      row: "#11111b",
      border: "#313244",
      text: "#cdd6f4",
      muted: "#9399b2",
      button: "#8a4fe0",
      link: "#cba6f7",
    },
  },
  {
    id: "ember",
    name: "Ember",
    description: "Graphite with a warm amber accent",
    swatch: {
      page: "#0e0e10",
      panel: "#18181b",
      row: "#0e0e10",
      border: "#27272a",
      text: "#f4f4f5",
      muted: "#a1a1aa",
      button: "#b45309",
      link: "#f59e0b",
    },
  },
] as const;

export const LIGHT_THEMES = [
  {
    id: "cool",
    name: "Cool white",
    description: "The original clean white with a sky-blue accent",
    swatch: {
      page: "#f8fafc",
      panel: "#ffffff",
      row: "#f8fafc",
      border: "#e2e8f0",
      text: "#0f172a",
      muted: "#64748b",
      button: "#0284c7",
      link: "#0284c7",
    },
  },
  {
    id: "paper",
    name: "Warm paper",
    description: "Soft cream with an ink-blue accent",
    swatch: {
      page: "#f4efe6",
      panel: "#ffffff",
      row: "#faf7f0",
      border: "#e6dfd0",
      text: "#25221d",
      muted: "#6f685b",
      button: "#3b5bdb",
      link: "#3b5bdb",
    },
  },
  {
    id: "mist",
    name: "Cool mist",
    description: "Soft blue-grey with an indigo accent",
    swatch: {
      page: "#eceff7",
      panel: "#ffffff",
      row: "#f6f7fd",
      border: "#dde1f0",
      text: "#1b1f3a",
      muted: "#5f6589",
      button: "#5555cc",
      link: "#5555cc",
    },
  },
] as const;

export type DarkThemeId = (typeof DARK_THEMES)[number]["id"];
export type LightThemeId = (typeof LIGHT_THEMES)[number]["id"];

export type Appearance = {
  mode: Mode;
  darkTheme: DarkThemeId;
  lightTheme: LightThemeId;
};

export const APPEARANCE_STORAGE_KEY = "devdesk-appearance";
// DevDesk used to save only "light" or "dark" here. It is still read once so
// nobody loses the mode they had.
export const LEGACY_THEME_STORAGE_KEY = "devdesk-theme";

export const DEFAULT_DARK_THEME: DarkThemeId = "navy";
export const DEFAULT_LIGHT_THEME: LightThemeId = "cool";

function isDarkThemeId(value: unknown): value is DarkThemeId {
  return DARK_THEMES.some((theme) => theme.id === value);
}

function isLightThemeId(value: unknown): value is LightThemeId {
  return LIGHT_THEMES.some((theme) => theme.id === value);
}

// Saved data can be missing, old or edited by hand, so every field is checked
// and anything unknown quietly falls back to a safe default.
export function normalizeAppearance(value: unknown, fallbackMode: Mode): Appearance {
  const record =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};

  return {
    mode:
      record.mode === "light" || record.mode === "dark"
        ? record.mode
        : fallbackMode,
    darkTheme: isDarkThemeId(record.darkTheme)
      ? record.darkTheme
      : DEFAULT_DARK_THEME,
    lightTheme: isLightThemeId(record.lightTheme)
      ? record.lightTheme
      : DEFAULT_LIGHT_THEME,
  };
}
