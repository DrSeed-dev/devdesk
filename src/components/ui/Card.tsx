import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function Card({ title, description, children }: CardProps) {
  return (
    <section className="flex min-h-[220px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_2px_4px_-2px_rgba(15,23,42,0.06),0_8px_16px_-4px_rgba(15,23,42,0.1)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-sky-900 dark:hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)]">
      <div>
        <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">
          {title}
        </h2>

        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex-1 text-sm text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}

export default Card;
