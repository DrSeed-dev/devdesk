export type RegexMatch = {
  index: number;
  text: string;
  groups: (string | null)[];
};

export type RegexSegment = {
  text: string;
  isMatch: boolean;
};

export type RegexResult =
  | {
      ok: true;
      matches: RegexMatch[];
      segments: RegexSegment[];
      truncated: boolean;
    }
  | { ok: false; error: string };

const MAX_MATCHES = 500;

// Finds every match. The "g" flag is always on so all matches are shown.
export function runRegex(pattern: string, flags: string, text: string): RegexResult {
  if (!pattern) {
    return {
      ok: true,
      matches: [],
      segments: text ? [{ text, isMatch: false }] : [],
      truncated: false,
    };
  }

  let regex: RegExp;

  try {
    regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid pattern.",
    };
  }

  const matches: RegexMatch[] = [];
  let truncated = false;

  for (const match of text.matchAll(regex)) {
    if (matches.length >= MAX_MATCHES) {
      truncated = true;
      break;
    }

    matches.push({
      index: match.index ?? 0,
      text: match[0],
      groups: match.slice(1).map((group) => group ?? null),
    });
  }

  // Build the highlighted view. Empty matches have nothing to highlight.
  const segments: RegexSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.text.length === 0) {
      continue;
    }

    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), isMatch: false });
    }

    segments.push({ text: match.text, isMatch: true });
    cursor = match.index + match.text.length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false });
  }

  return { ok: true, matches, segments, truncated };
}

export const REGEX_SAMPLE_TEXT =
  "Contact ada@example.com or bayo@devdesk.dev before 2026-12-01.";
export const REGEX_SAMPLE_PATTERN = "[\\w.]+@[\\w.]+\\.\\w+";
