import { useEffect, useId, useRef, useState } from "react";

const SYNC_EVENT = "devdesk-storage-sync";

type SyncDetail = {
  key: string;
  instanceId: string;
};

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
  // Stable, unique ID per component instance — safe to read during
  // render, unlike a manual ref/counter.
  const instanceId = useId();

  // Neither of these is ever read during render — only inside effects
  // and event handlers — so they don't trip the refs-during-render rule.
  const isFirstRun = useRef(true);
  const isSyncUpdate = useRef(false);

  const [value, setValue] = useState<T>(() =>
    readStoredValue(key, initialValue),
  );

  useEffect(() => {
    // Nothing actually changed yet on mount — just skip announcing it.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    // This update arrived FROM another instance's broadcast — the data
    // is already correct in localStorage, so writing and re-announcing
    // it here is exactly what caused the infinite ping-pong between
    // two components sharing the same key. Skip it, once, then reset.
    if (isSyncUpdate.current) {
      isSyncUpdate.current = false;
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));

    window.dispatchEvent(
      new CustomEvent<SyncDetail>(SYNC_EVENT, { detail: { key, instanceId } }),
    );
  }, [key, value, instanceId]);

  useEffect(() => {
    function handleSync(event: Event) {
      const { key: changedKey, instanceId: sourceId } = (
        event as CustomEvent<SyncDetail>
      ).detail;

      if (changedKey === key && sourceId !== instanceId) {
        isSyncUpdate.current = true;
        setValue(readStoredValue(key, initialValue));
      }
    }

    window.addEventListener(SYNC_EVENT, handleSync);
    return () => window.removeEventListener(SYNC_EVENT, handleSync);
  }, [key, instanceId]);

  return [value, setValue] as const;
}
