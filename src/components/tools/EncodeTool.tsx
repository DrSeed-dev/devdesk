import { useMemo, useState } from "react";
import {
  base64Decode,
  base64Encode,
  urlDecode,
  urlEncode,
} from "../../lib/tools/encoding";
import CopyButton from "../ui/CopyButton";
import { CODE_AREA_CLASS, LABEL_CLASS } from "../ui/fieldStyles";
import SegmentedControl from "../ui/SegmentedControl";

type Format = "base64" | "url";
type Direction = "encode" | "decode";

const FORMATS: { id: Format; label: string }[] = [
  { id: "base64", label: "Base64" },
  { id: "url", label: "URL" },
];

const DIRECTIONS: { id: Direction; label: string }[] = [
  { id: "encode", label: "Encode" },
  { id: "decode", label: "Decode" },
];

function EncodeTool() {
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<Format>("base64");
  const [direction, setDirection] = useState<Direction>("encode");
  const [urlSafe, setUrlSafe] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) {
      return { output: "", error: "" };
    }

    try {
      if (format === "base64") {
        return {
          output:
            direction === "encode"
              ? base64Encode(input, urlSafe)
              : base64Decode(input),
          error: "",
        };
      }

      return {
        output: direction === "encode" ? urlEncode(input) : urlDecode(input),
        error: "",
      };
    } catch (caught) {
      return {
        output: "",
        error: caught instanceof Error ? caught.message : "Couldn't convert that.",
      };
    }
  }, [input, format, direction, urlSafe]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Turn text into Base64 or URL-safe text and back again. Emoji and
        accented letters work too.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl items={FORMATS} activeId={format} onChange={setFormat} />
        <SegmentedControl
          items={DIRECTIONS}
          activeId={direction}
          onChange={setDirection}
        />

        {format === "base64" && direction === "encode" ? (
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(event) => setUrlSafe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600"
            />
            URL-safe (no + / =)
          </label>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="encode-input" className={LABEL_CLASS}>
            Input
          </label>
          <textarea
            id="encode-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={10}
            spellCheck={false}
            maxLength={100000}
            className={CODE_AREA_CLASS}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="encode-output" className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Result
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="encode-output"
            readOnly
            value={output}
            rows={10}
            spellCheck={false}
            className={`${CODE_AREA_CLASS} bg-slate-50 dark:bg-slate-900`}
          />
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default EncodeTool;
