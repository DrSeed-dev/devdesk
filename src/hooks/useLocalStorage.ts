import { useEffect, useState } from "react";

const SYNC_EVENT = "devdesk-storage-sync";

function readStoredValue<T>(key: string, initialValue: T): T {
  const savedValue = localStorage.getItem(key);

  if (!savedValue) {
    return initialValue;
  }

  try {
    return JSON.parse(savedValue) as T;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() =>
    readStoredValue(key, initialValue),
  );

  // Persist this instance's own changes, then tell every other
  // component reading the same key that it needs to re-sync.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: key }));
  }, [key, value]);

  // Listen for changes written by other components sharing this key,
  // so every reader of `devdesk-todos` (for example) stays live-accurate
  // without prop-drilling state through the whole app.
  useEffect(() => {
    function handleSync(event: Event) {
      const changedKey = (event as CustomEvent<string>).detail;

      if (changedKey === key) {
        setValue(readStoredValue(key, initialValue));
      }
    }

    window.addEventListener(SYNC_EVENT, handleSync);
    return () => window.removeEventListener(SYNC_EVENT, handleSync);
  }, [key]);

  return [value, setValue] as const;
}
