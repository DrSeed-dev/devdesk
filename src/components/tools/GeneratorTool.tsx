import { useState } from "react";
import {
  estimateEntropyBits,
  generatePassword,
  generateUuids,
  strengthLabel,
  type PasswordOptions,
} from "../../lib/tools/generators";
import Button from "../ui/Button";
import CopyButton from "../ui/CopyButton";
import Select, { type SelectOption } from "../ui/Select";
import ResultRow from "./ResultRow";

const COUNT_OPTIONS: SelectOption<"1" | "5" | "10">[] = [
  { value: "1", label: "1 UUID" },
  { value: "5", label: "5 UUIDs" },
  { value: "10", label: "10 UUIDs" },
];

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
};

const GROUPS: { key: keyof Omit<PasswordOptions, "length">; label: string }[] = [
  { key: "lowercase", label: "a-z" },
  { key: "uppercase", label: "A-Z" },
  { key: "numbers", label: "0-9" },
  { key: "symbols", label: "!@#$" },
];

// Written out in full so Tailwind can see every class.
const STRENGTH_BAR: Record<string, string> = {
  Weak: "bg-rose-500",
  Fair: "bg-amber-500",
  Strong: "bg-sky-500",
  "Very strong": "bg-emerald-500",
};

function GeneratorTool() {
  const [uuidCount, setUuidCount] = useState<"1" | "5" | "10">("1");
  const [uuids, setUuids] = useState(() => generateUuids(1));
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState(
    () => generatePassword(DEFAULT_OPTIONS) ?? "",
  );

  const bits = estimateEntropyBits(options);
  const strength = strengthLabel(bits);

  function updateOptions(next: PasswordOptions) {
    setOptions(next);
    setPassword(generatePassword(next) ?? "");
  }

  function toggleGroup(key: keyof Omit<PasswordOptions, "length">) {
    const next = { ...options, [key]: !options[key] };
    const anyOn = next.lowercase || next.uppercase || next.numbers || next.symbols;

    // Keep at least one group on, or there would be nothing to pick from.
    if (anyOn) {
      updateOptions(next);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          UUID generator
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Random version 4 UUIDs, made with your browser's secure random source.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            label="How many UUIDs"
            value={uuidCount}
            options={COUNT_OPTIONS}
            onChange={(value) => {
              setUuidCount(value);
              setUuids(generateUuids(Number(value)));
            }}
            className="w-36"
          />
          <Button type="button" onClick={() => setUuids(generateUuids(Number(uuidCount)))}>
            Generate
          </Button>
          {uuids.length > 1 ? (
            <CopyButton text={uuids.join("\n")} label="Copy all" />
          ) : null}
        </div>

        <div className="space-y-2">
          {uuids.map((id) => (
            <ResultRow key={id} label="UUID v4" value={id} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Password generator
        </h3>

        <ResultRow label="Password" value={password} />

        <div>
          <label
            htmlFor="password-length"
            className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            <span>Length</span>
            <span className="tabular-nums">{options.length}</span>
          </label>
          <input
            id="password-length"
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(event) =>
              updateOptions({ ...options, length: Number(event.target.value) })
            }
            className="w-full accent-sky-600"
          />
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {GROUPS.map((group) => (
            <label
              key={group.key}
              className="flex items-center gap-2 font-mono text-sm text-slate-700 dark:text-slate-200"
            >
              <input
                type="checkbox"
                checked={options[group.key]}
                onChange={() => toggleGroup(group.key)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600"
              />
              {group.label}
            </label>
          ))}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Strength: {strength}</span>
            <span className="tabular-nums">{bits} bits</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${STRENGTH_BAR[strength]}`}
              style={{ width: `${Math.min(100, (bits / 128) * 100)}%` }}
            />
          </div>
        </div>

        <Button type="button" onClick={() => setPassword(generatePassword(options) ?? "")}>
          Generate new password
        </Button>
      </section>
    </div>
  );
}

export default GeneratorTool;
