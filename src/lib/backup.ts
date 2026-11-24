import { STORAGE_KEYS } from "./storageKeys";

const BACKUP_APP_NAME = "devdesk";
const BACKUP_VERSION = 1;

export const MAX_BACKUP_BYTES = 1024 * 1024; // 1 MB is far more than DevDesk ever stores

type BackupData = Record<string, unknown>;

type ParseResult =
  | { ok: true; data: BackupData }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isListOf(
  value: unknown,
  isValidItem: (item: Record<string, unknown>) => boolean,
) {
  return (
    Array.isArray(value) &&
    value.every((item) => isRecord(item) && isValidItem(item))
  );
}

// Every saved value is checked before it is allowed in. A backup file is
// user-supplied input, so it is treated as untrusted: wrong shapes are
// rejected, and links must be real http(s) links (never "javascript:").
const VALIDATORS: Record<string, (value: unknown) => boolean> = {
  [STORAGE_KEYS.todos]: (value) =>
    isListOf(
      value,
      (item) =>
        isString(item.id) &&
        isString(item.title) &&
        typeof item.isCompleted === "boolean",
    ),
  [STORAGE_KEYS.notes]: (value) =>
    isListOf(
      value,
      (item) =>
        isString(item.id) &&
        isString(item.content) &&
        isString(item.createdAt),
    ),
  [STORAGE_KEYS.alarms]: (value) =>
    isListOf(
      value,
      (item) =>
        isString(item.id) &&
        isString(item.label) &&
        typeof item.enabled === "boolean" &&
        isString(item.time) &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(item.time),
    ),
  [STORAGE_KEYS.contacts]: (value) =>
    isListOf(
      value,
      (item) =>
        isString(item.id) &&
        isString(item.name) &&
        isString(item.role) &&
        isString(item.note) &&
        isString(item.linkedinUrl) &&
        (item.linkedinUrl === "" || /^https?:\/\//i.test(item.linkedinUrl)) &&
        (item.company === undefined || isString(item.company)) &&
        (item.followUpOn === undefined ||
          (isString(item.followUpOn) &&
            (item.followUpOn === "" ||
              /^\d{4}-\d{2}-\d{2}$/.test(item.followUpOn)))),
    ),
  [STORAGE_KEYS.weatherCity]: (value) => isString(value) && value.length <= 100,
  [STORAGE_KEYS.githubUsername]: (value) =>
    isString(value) && value.length <= 100,
};

export function downloadBackup() {
  const data: BackupData = {};

  for (const key of Object.values(STORAGE_KEYS)) {
    const raw = localStorage.getItem(key);

    if (raw === null) {
      continue;
    }

    try {
      data[key] = JSON.parse(raw);
    } catch {
      // Skip anything unreadable instead of failing the whole backup.
    }
  }

  const backup = {
    app: BACKUP_APP_NAME,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `devdesk-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

export function parseBackup(text: string): ParseResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }

  if (
    !isRecord(parsed) ||
    parsed.app !== BACKUP_APP_NAME ||
    !isRecord(parsed.data)
  ) {
    return { ok: false, error: "That doesn't look like a DevDesk backup file." };
  }

  const data: BackupData = {};

  for (const [key, value] of Object.entries(parsed.data)) {
    const validate = VALIDATORS[key];

    // Keys DevDesk doesn't know about are ignored, never stored.
    if (!validate) {
      continue;
    }

    if (!validate(value)) {
      return {
        ok: false,
        error: "The backup has data in a format DevDesk can't read.",
      };
    }

    data[key] = value;
  }

  if (Object.keys(data).length === 0) {
    return { ok: false, error: "That backup file has no DevDesk data in it." };
  }

  return { ok: true, data };
}

export function summarizeBackup(data: BackupData): string {
  const describe = (key: string, singular: string, plural: string) => {
    const value = data[key];

    if (!Array.isArray(value)) {
      return null;
    }

    return `${value.length} ${value.length === 1 ? singular : plural}`;
  };

  const parts = [
    describe(STORAGE_KEYS.todos, "task", "tasks"),
    describe(STORAGE_KEYS.notes, "note", "notes"),
    describe(STORAGE_KEYS.contacts, "contact", "contacts"),
    describe(STORAGE_KEYS.alarms, "alarm", "alarms"),
  ].filter((part): part is string => part !== null);

  return parts.length > 0 ? parts.join(", ") : "your saved settings";
}

// Replaces what's on this device with the backup. Anything the backup
// doesn't contain is cleared, so the result matches the file exactly.
export function restoreBackup(data: BackupData) {
  for (const key of Object.values(STORAGE_KEYS)) {
    if (key in data) {
      localStorage.setItem(key, JSON.stringify(data[key]));
    } else {
      localStorage.removeItem(key);
    }
  }
}