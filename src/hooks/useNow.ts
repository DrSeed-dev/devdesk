import { useEffect, useState } from "react";

// The current time, refreshed on an interval, so a component can show
// "today" or "3 minutes ago" without reading the clock while it renders.
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs]);

  return now;
}
