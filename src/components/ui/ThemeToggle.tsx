type ThemeToggleProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

function ThemeToggle({ theme, onToggleTheme }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}

export default ThemeToggle;