import { useEffect, useState } from "react";
import { DatabaseBackup } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import BackupDialog from "./BackupDialog";
import WorkspaceStrip from "./WorkspaceStrip";

type TopBarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

function formatClock(date: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function TopBarClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
      {formatClock(now)}
    </span>
  );
}

function TopBar({ theme, onToggleTheme }: TopBarProps) {
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
          D
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-slate-950 dark:text-slate-100">
          DevDesk
        </span>
        <span className="hidden text-sm text-slate-400 dark:text-slate-500 sm:inline">
          / Workspace
        </span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <WorkspaceStrip />
        <TopBarClock />

        <button
          type="button"
          onClick={() => setIsBackupOpen(true)}
          aria-label="Backup and restore"
          title="Backup and restore"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
        >
          <DatabaseBackup size={15} aria-hidden="true" />
        </button>

        <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
      </div>

      {isBackupOpen ? (
        <BackupDialog onClose={() => setIsBackupOpen(false)} />
      ) : null}
    </header>
  );
}

export default TopBar;