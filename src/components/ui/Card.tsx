import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function Card({ title, description, children }: CardProps) {
  return (
    <section className="flex min-h-[220px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-900">
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