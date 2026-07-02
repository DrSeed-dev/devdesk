type StatCardProps = {
    label: string;
    value: string;
    helperText?: string;
};

function StatCard({ label, value, helperText }: StatCardProps) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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