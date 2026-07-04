type SegmentedControlItem<T extends string> = {
  id: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  items: SegmentedControlItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
};

function SegmentedControl<T extends string>({
  items,
  activeId,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className="inline-flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
              isActive
                ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
