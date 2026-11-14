import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

type PanelProps = {
  id?: string;
  title: string;
  icon: ComponentType<LucideProps>;
  meta?: ReactNode;
  scroll?: boolean;
  className?: string;
  children: ReactNode;
};

function Panel({
  id,
  title,
  icon: Icon,
  meta,
  scroll = false,
  className = "",
  children,
}: PanelProps) {
  return (
    <section
      id={id}
      aria-label={title}
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/70 p-3 transition-colors focus-within:border-sky-300 dark:border-slate-800 dark:bg-slate-900/70 dark:focus-within:border-sky-800 ${className}`}
    >
      <header className="flex items-center gap-2 pb-3">
        <Icon
          size={16}
          strokeWidth={2}
          className="text-slate-700 dark:text-slate-300"
          aria-hidden="true"
        />
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {meta ? (
          <span className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400">
            {meta}
          </span>
        ) : null}
      </header>

      <div
        className={`min-h-0 flex-1 ${
          scroll ? "thin-scrollbar overflow-y-auto pr-1" : "flex flex-col"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export default Panel;