import { useMemo, useState } from "react";
import {
  REGEX_SAMPLE_PATTERN,
  REGEX_SAMPLE_TEXT,
  runRegex,
} from "../../lib/tools/regex";
import Button from "../ui/Button";
import { CODE_AREA_CLASS, INPUT_CLASS, LABEL_CLASS } from "../ui/fieldStyles";

const FLAG_OPTIONS = [
  { flag: "i", label: "Ignore case" },
  { flag: "m", label: "Multiline" },
  { flag: "s", label: "Dot matches newline" },
  { flag: "u", label: "Unicode" },
] as const;

function RegexTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string[]>([]);
  const [text, setText] = useState("");

  const result = useMemo(
    () => runRegex(pattern, flags.join(""), text),
    [pattern, flags, text],
  );

  function toggleFlag(flag: string) {
    setFlags((current) =>
      current.includes(flag)
        ? current.filter((item) => item !== flag)
        : [...current, flag],
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Try a regular expression against some text and see every match
        highlighted, with its capture groups.
      </p>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="regex-pattern" className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Pattern
          </label>
          <Button
            type="button"
            variant="ghost"
            className="px-3 py-1 text-xs"
            onClick={() => {
              setPattern(REGEX_SAMPLE_PATTERN);
              setText(REGEX_SAMPLE_TEXT);
            }}
          >
            Load sample
          </Button>
        </div>
        <input
          id="regex-pattern"
          type="text"
          value={pattern}
          onChange={(event) => setPattern(event.target.value)}
          spellCheck={false}
          placeholder="(\d{4})-(\d{2})"
          className={`${INPUT_CLASS} font-mono`}
        />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {FLAG_OPTIONS.map((option) => (
          <label
            key={option.flag}
            className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
          >
            <input
              type="checkbox"
              checked={flags.includes(option.flag)}
              onChange={() => toggleFlag(option.flag)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600"
            />
            {option.label}
          </label>
        ))}
      </div>

      <div>
        <label htmlFor="regex-text" className={LABEL_CLASS}>
          Text to test
        </label>
        <textarea
          id="regex-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={6}
          spellCheck={false}
          maxLength={20000}
          className={CODE_AREA_CLASS}
        />
      </div>

      {!result.ok ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {result.error}
        </p>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className={LABEL_CLASS}>
              {result.matches.length === 1
                ? "1 match"
                : `${result.matches.length} matches`}
              {result.truncated ? " (showing the first 500)" : ""}
            </h3>
            <pre className="thin-scrollbar max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              {result.segments.length === 0
                ? "Nothing to show yet."
                : result.segments.map((segment, index) =>
                    segment.isMatch ? (
                      <mark
                        key={index}
                        className="rounded bg-amber-200 px-0.5 text-slate-900 dark:bg-amber-500/40 dark:text-amber-50"
                      >
                        {segment.text}
                      </mark>
                    ) : (
                      <span key={index}>{segment.text}</span>
                    ),
                  )}
            </pre>
          </div>

          {result.matches.length > 0 ? (
            <div className="thin-scrollbar max-h-60 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2 font-semibold">#</th>
                    <th className="px-3 py-2 font-semibold">Position</th>
                    <th className="px-3 py-2 font-semibold">Match</th>
                    <th className="px-3 py-2 font-semibold">Groups</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-slate-800 dark:text-slate-200">
                  {result.matches.map((match, index) => (
                    <tr
                      key={`${match.index}-${index}`}
                      className="border-t border-slate-200 dark:border-slate-800"
                    >
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{match.index}</td>
                      <td className="break-all px-3 py-2">{match.text || "(empty)"}</td>
                      <td className="break-all px-3 py-2">
                        {match.groups.length === 0
                          ? "none"
                          : match.groups
                              .map((group, groupIndex) => `${groupIndex + 1}: ${group ?? "no match"}`)
                              .join(" | ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default RegexTool;
