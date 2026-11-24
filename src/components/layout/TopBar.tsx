import { useState } from "react";
import { DatabaseBackup } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useNow } from "../../hooks/useNow";
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
  const now = useNow(1000);

  return (
    <span className="hidden text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100 sm:inline">
      {formatClock(now)}
    </span>
  );
}

function pageLabel(pathname: string) {
  if (pathname === "/") return "Workspace";
  if (pathname.startsWith("/tools")) return "Dev tools";
  return "Not found";
}

// The side rail is hidden on phones, so these two links stand in for it.
function MobileNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-2.5 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
      isActive
        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <nav aria-label="Main" className="flex gap-1 lg:hidden">
      <NavLink to="/" end className={linkClass}>
        Desk
      </NavLink>
      <NavLink to="/tools" className={linkClass}>
        Tools
      </NavLink>
    </nav>
  );
}

function TopBar({ theme, onToggleTheme }: TopBarProps) {
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/80 px-3 dark:border-slate-800 dark:bg-slate-900/80 sm:gap-4 sm:px-4">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-slate-950 dark:text-slate-100">
          DevDesk
        </span>
        <span className="hidden text-sm text-slate-400 dark:text-slate-500 sm:inline">
          / {pageLabel(pathname)}
        </span>
      </div>

      <MobileNav />

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
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
