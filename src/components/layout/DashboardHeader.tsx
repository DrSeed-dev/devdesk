import ThemeToggle from "../ui/ThemeToggle";

type DashboardHeaderProps = {
    theme: "light" | "dark";
    onToggleTheme: () => void;
};

function DashboardHeader({ theme, onToggleTheme }: DashboardHeaderProps) {
    return (
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                    DevDesk
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-slate-100 sm:text-3xl">
                    Your workspace, at a glance.
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Time, weather, tasks, and notes — all in one dashboard.
                </p>
            </div>

            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        </header>
    );
}

export default DashboardHeader;