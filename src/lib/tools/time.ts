// Accepts seconds or milliseconds. Anything below 100 billion is treated as
// seconds (that is the year 5138 in seconds, but only 1973 in milliseconds).
export function parseTimestamp(input: string): Date | null {
  const trimmed = input.trim();

  if (!/^-?\d{1,16}$/.test(trimmed)) {
    return null;
  }

  const value = Number(trimmed);
  const milliseconds = Math.abs(value) < 1e11 ? value * 1000 : value;
  const date = new Date(milliseconds);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function toUnix(date: Date) {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    milliseconds: date.getTime(),
  };
}

const RELATIVE_UNITS: [number, Intl.RelativeTimeFormatUnit][] = [
  [60 * 60 * 24 * 365, "year"],
  [60 * 60 * 24 * 30, "month"],
  [60 * 60 * 24, "day"],
  [60 * 60, "hour"],
  [60, "minute"],
  [1, "second"],
];

export function formatRelative(date: Date, now: Date): string {
  const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const absolute = Math.abs(diffSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [size, unit] of RELATIVE_UNITS) {
    if (absolute >= size || unit === "second") {
      return formatter.format(Math.round(diffSeconds / size), unit);
    }
  }

  return "now";
}

export function formatLocal(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);
}

// The value an <input type="datetime-local"> expects, in local time.
export function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
