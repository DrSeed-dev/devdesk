import type { ComponentType } from "react";
import { LayoutDashboard, Wrench, type LucideProps } from "lucide-react";
import { NavLink } from "react-router-dom";

type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<LucideProps>;
  end: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Desk", icon: LayoutDashboard, end: true },
  { to: "/tools", label: "Tools", icon: Wrench, end: false },
];

function Sidebar() {
  return (
    <aside className="relative z-10 hidden w-14 shrink-0 flex-col items-center border-r border-slate-200 bg-white/80 py-3 dark:border-slate-800 dark:bg-slate-900/80 lg:flex">
      <NavLink
        to="/"
        aria-label="DevDesk home"
        className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-white dark:text-slate-950 dark:focus:ring-offset-slate-900"
      >
        D
      </NavLink>

      <nav aria-label="Main" className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex w-11 flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              }`
            }
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
