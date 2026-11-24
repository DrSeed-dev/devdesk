import { useEffect, useState } from "react";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function ClockPanel() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-2 text-center">
      <p className="text-4xl font-bold tabular-nums tracking-tight text-slate-950 dark:text-white xl:text-5xl">
        {formatTime(currentDate)}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        {formatDate(currentDate)}
      </p>
    </div>
  );
}

export default ClockPanel;
