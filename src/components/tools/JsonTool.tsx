import { useMemo, useState } from "react";
import { JSON_SAMPLE, processJson, type JsonMode } from "../../lib/tools/json";
import Button from "../ui/Button";
import CopyButton from "../ui/CopyButton";
import { CODE_AREA_CLASS, LABEL_CLASS } from "../ui/fieldStyles";
import Select, { type SelectOption } from "../ui/Select";

const MODE_OPTIONS: SelectOption<JsonMode>[] = [
  { value: "format2", label: "Format, 2 spaces" },
  { value: "format4", label: "Format, 4 spaces" },
  { value: "minify", label: "Minify" },
];

function JsonTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<JsonMode>("format2");
  const [sortKeys, setSortKeys] = useState(false);

  const result = useMemo(
    () => (input.trim() ? processJson(input, mode, sortKeys) : null),
    [input, mode, sortKeys],
  );

  const output = result?.ok ? result.output : "";

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Paste JSON to tidy it up, shrink it, or find out exactly where it is
        broken. Everything runs in your browser and nothing is sent anywhere.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          label="Output style"
          value={mode}
          options={MODE_OPTIONS}
          onChange={setMode}
          className="w-48"
        />

        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(event) => setSortKeys(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-600"
          />
          Sort keys A to Z
        </label>

        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="ghost"
            className="px-3 py-1 text-xs"
            onClick={() => setInput(JSON_SAMPLE)}
          >
            Load sample
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="px-3 py-1 text-xs"
            onClick={() => setInput("")}
            disabled={!input}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="json-input" className={LABEL_CLASS}>
            Input
          </label>
          <textarea
            id="json-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={14}
            spellCheck={false}
            maxLength={200000}
            placeholder='{"paste": "your JSON here"}'
            className={CODE_AREA_CLASS}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="json-output" className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Result
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="json-output"
            readOnly
            value={output}
            rows={14}
            spellCheck={false}
            className={`${CODE_AREA_CLASS} bg-slate-50 dark:bg-slate-900`}
          />
        </div>
      </div>

      {result && !result.ok ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {result.line !== undefined
            ? `Line ${result.line}, column ${result.column}: `
            : ""}
          {result.message}
        </p>
      ) : null}
    </div>
  );
}

export default JsonTool;
