import type { ComponentType } from "react";
import {
  Clock,
  CloudSun,
  GitFork,
  ListTodo,
  NotebookPen,
  Users,
  type LucideProps,
} from "lucide-react";

type NavItem = {
  panelId: string;
  label: string;
  icon: ComponentType<LucideProps>;
};

const NAV_ITEMS: NavItem[] = [
  { panelId: "panel-tasks", label: "Tasks", icon: ListTodo },
  { panelId: "panel-notes", label: "Notes", icon: NotebookPen },
  { panelId: "panel-people", label: "People", icon: Users },
  { panelId: "panel-clock", label: "Clock", icon: Clock },
  { panelId: "panel-weather", label: "Weather", icon: CloudSun },
  { panelId: "panel-github", label: "GitHub", icon: GitFork },
];

// Scrolls the panel into view and puts the cursor in its first text field,
// so the rail works as "take me there and let me type".
function jumpToPanel(panelId: string) {
  const panel = document.getElementById(panelId);

  if (!panel) {
    return;
  }

  panel.scrollIntoView({ block: "nearest" });
  panel
    .querySelector<HTMLElement>("input:not([type='checkbox']), textarea")
    ?.focus({ preventScroll: true });
}

function Sidebar() {
  return (
    <aside className="relative z-10 hidden w-14 shrink-0 flex-col items-center border-r border-slate-200 bg-white/80 py-3 dark:border-slate-800 dark:bg-slate-900/80 lg:flex">
      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
        D
      </div>

      <nav aria-label="Jump to panel" className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ panelId, label, icon: Icon }) => (
          <button
            key={panelId}
            type="button"
            title={label}
            aria-label={`Go to ${label}`}
            onClick={() => jumpToPanel(panelId)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;