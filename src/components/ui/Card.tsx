import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function Card({ title, description, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
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

      <div className="mt-5 text-sm text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}

export default Card;