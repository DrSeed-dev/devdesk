import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const savedValue = localStorage.getItem(key);

    if (!savedValue) {
      return initialValue;
    }

    return JSON.parse(savedValue) as T;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}