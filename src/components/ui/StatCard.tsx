type StatCardProps = {
  label: string;
  value: string;
  helperText?: string;
};

function StatCard({ label, value, helperText }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_2px_4px_-2px_rgba(15,23,42,0.06),0_8px_16px_-4px_rgba(15,23,42,0.1)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-sky-900 dark:hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-100">
        {value}
      </p>
      {helperText ? (
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default StatCard;
