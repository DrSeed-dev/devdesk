import CopyButton from "../ui/CopyButton";

type ResultRowProps = {
  label: string;
  value: string;
};

// One labelled result with a copy button, used across the tools.
function ResultRow({ label, value }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="break-all font-mono text-sm text-slate-900 dark:text-slate-100">
          {value}
        </p>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

export default ResultRow;
