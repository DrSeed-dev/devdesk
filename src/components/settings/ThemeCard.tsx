import { Check, ListTodo } from "lucide-react";
import type { ThemeOption } from "../../lib/themes";

type ThemeCardProps = {
  theme: ThemeOption;
  selected: boolean;
  onSelect: () => void;
};

// A small preview of the theme, drawn with that theme's own colours, so you
// can compare them before choosing.
function ThemeCard({ theme, selected, onSelect }: ThemeCardProps) {
  const { swatch } = theme;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-xl border p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 ${
        selected
          ? "border-sky-500 bg-sky-50/60 dark:bg-sky-950/40"
          : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
      }`}
    >
      <div className="rounded-lg p-2.5" style={{ background: swatch.page }}>
        <div
          className="space-y-1.5 rounded-md border p-2"
          style={{
            background: swatch.panel,
            borderColor: swatch.border,
            color: swatch.text,
          }}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <ListTodo size={13} aria-hidden="true" style={{ color: swatch.link }} />
            Tasks
            <span
              className="ml-auto text-[10px] font-medium"
              style={{ color: swatch.muted }}
            >
              2 open
            </span>
          </div>

          <div className="rounded px-1.5 py-1 text-[11px]" style={{ background: swatch.row }}>
            Fix deploy
          </div>
          <div className="rounded px-1.5 py-1 text-[11px]" style={{ background: swatch.row }}>
            Review PR
          </div>

          <span
            className="inline-block rounded px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: swatch.button, color: "#ffffff" }}
          >
            Add
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-start justify-between gap-2 px-1 pb-0.5">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {theme.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {theme.description}
          </p>
        </div>

        {selected ? (
          <Check
            size={16}
            aria-label="Selected"
            className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400"
          />
        ) : null}
      </div>
    </button>
  );
}

export default ThemeCard;
