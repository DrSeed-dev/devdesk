import { useState } from "react";
import { useNow } from "../../hooks/useNow";
import {
  formatLocal,
  formatRelative,
  parseTimestamp,
  toDateTimeLocalValue,
  toUnix,
} from "../../lib/tools/time";
import Button from "../ui/Button";
import { INPUT_CLASS, LABEL_CLASS } from "../ui/fieldStyles";
import ResultRow from "./ResultRow";

function TimeTool() {
  const now = useNow(1000);
  const [timestamp, setTimestamp] = useState("");
  const [localValue, setLocalValue] = useState(() =>
    toDateTimeLocalValue(new Date()),
  );

  const parsed = timestamp.trim() ? parseTimestamp(timestamp) : null;

  const fromLocal = localValue ? new Date(localValue) : null;
  const validFromLocal =
    fromLocal && !Number.isNaN(fromLocal.getTime()) ? fromLocal : null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Convert between Unix timestamps and readable dates. The current Unix
        time is{" "}
        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
          {toUnix(now).seconds}
        </span>
        .
      </p>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Timestamp to date
        </h3>

        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="time-stamp" className="sr-only">
              Unix timestamp
            </label>
            <input
              id="time-stamp"
              type="text"
              inputMode="numeric"
              value={timestamp}
              onChange={(event) => setTimestamp(event.target.value)}
              placeholder="1700000000 or 1700000000000"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setTimestamp(String(toUnix(new Date()).seconds))}
          >
            Use now
          </Button>
        </div>

        {timestamp.trim() && !parsed ? (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
            Enter whole numbers only, in seconds or milliseconds.
          </p>
        ) : null}

        {parsed ? (
          <div className="space-y-2">
            <ResultRow label="Your local time" value={formatLocal(parsed)} />
            <ResultRow label="UTC" value={parsed.toUTCString()} />
            <ResultRow label="ISO 8601" value={parsed.toISOString()} />
            <ResultRow label="Relative" value={formatRelative(parsed, now)} />
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Date to timestamp
        </h3>

        <div>
          <label htmlFor="time-local" className={LABEL_CLASS}>
            Date and time (your local time)
          </label>
          <input
            id="time-local"
            type="datetime-local"
            value={localValue}
            onChange={(event) => setLocalValue(event.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        {validFromLocal ? (
          <div className="space-y-2">
            <ResultRow
              label="Unix seconds"
              value={String(toUnix(validFromLocal).seconds)}
            />
            <ResultRow
              label="Unix milliseconds"
              value={String(toUnix(validFromLocal).milliseconds)}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default TimeTool;
