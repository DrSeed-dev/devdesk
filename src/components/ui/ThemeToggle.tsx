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
      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}

export default ThemeToggle;