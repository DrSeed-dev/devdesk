export type JsonMode = "format2" | "format4" | "minify";

export type JsonResult =
  | { ok: true; output: string }
  | { ok: false; message: string; line?: number; column?: number };

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, sortKeysDeep(child)]),
    );
  }

  return value;
}

function locate(input: string, position: number) {
  const before = input.slice(0, position);
  const lines = before.split("\n");

  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

export function processJson(
  input: string,
  mode: JsonMode,
  shouldSortKeys: boolean,
): JsonResult {
  try {
    let value: unknown = JSON.parse(input);

    if (shouldSortKeys) {
      value = sortKeysDeep(value);
    }

    const output =
      mode === "minify"
        ? JSON.stringify(value)
        : JSON.stringify(value, null, mode === "format2" ? 2 : 4);

    return { ok: true, output };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON.";

    // Newer browsers say "(line 3 column 5)"; older ones only give a position.
    const lineColumn = /line (\d+) column (\d+)/.exec(message);

    if (lineColumn) {
      return {
        ok: false,
        message,
        line: Number(lineColumn[1]),
        column: Number(lineColumn[2]),
      };
    }

    const position = /position (\d+)/.exec(message);

    if (position) {
      return { ok: false, message, ...locate(input, Number(position[1])) };
    }

    return { ok: false, message };
  }
}

export const JSON_SAMPLE = `{"name":"DevDesk","version":1,"tags":["react","typescript"],"author":{"name":"DrSeed Dev","open_to_work":true}}`;
