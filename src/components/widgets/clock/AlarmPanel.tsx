import { useEffect, useRef, useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../../lib/storageKeys";
import Button from "../../ui/Button";

type Alarm = {
  id: string;
  time: string; // 24-hour "HH:MM", matches <input type="time">
  label: string;
  enabled: boolean;
};

function formatAlarmTime(time: string) {
  const [hourStr, minuteStr] = time.split(":");
  const reference = new Date();
  reference.setHours(Number(hourStr), Number(minuteStr), 0, 0);

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(reference);
}

// A short two-tone beep using the Web Audio API — no audio file needed,
// and it fails silently on browsers/contexts that don't support it.
function playAlarmSound() {
  try {
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const context = new AudioContextClass();

    const start = () => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      oscillator.connect(gain);
      gain.connect(context.destination);
      gain.gain.setValueAtTime(0.15, context.currentTime);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);
    };

    // Browsers can create a new AudioContext already "suspended" if it
    // wasn't triggered by a direct user gesture — which a timer firing
    // never is. Resuming it explicitly avoids the sound silently failing.
    if (context.state === "suspended") {
      void context.resume().then(start);
    } else {
      start();
    }
  } catch {
    // Web Audio unsupported — the visual banner still shows either way.
  }
}

function AlarmPanel() {
  const [alarms, setAlarms] = useLocalStorage<Alarm[]>(
    STORAGE_KEYS.alarms,
    [],
  );
  const [time, setTime] = useState("07:00");
  const [label, setLabel] = useState("");
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);

  // Tracks which alarms already fired for the current minute, so the
  // once-per-second check below doesn't re-trigger 60 times in a row.
  // Intentionally not persisted — resets on reload, which is fine.
  const firedThisMinute = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      void Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const now = new Date();
      const minuteKey = `${now.getHours()}:${now.getMinutes()}`;

      alarms.forEach((alarm) => {
        if (!alarm.enabled) return;

        const [hourStr, minuteStr] = alarm.time.split(":");
        const isMatch =
          now.getHours() === Number(hourStr) &&
          now.getMinutes() === Number(minuteStr);

        const fireKey = `${alarm.id}-${minuteKey}`;

        if (isMatch && !firedThisMinute.current.has(fireKey)) {
          firedThisMinute.current.add(fireKey);
          setRingingAlarm(alarm);
          playAlarmSound();

          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            new Notification(alarm.label || "DevDesk Alarm", {
              body: formatAlarmTime(alarm.time),
            });
          }
        }
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [alarms]);

  function handleAddAlarm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAlarms((current) => [
      ...current,
      { id: crypto.randomUUID(), time, label: label.trim(), enabled: true },
    ]);
    setLabel("");
  }

  function handleToggleAlarm(id: string) {
    setAlarms((current) =>
      current.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm,
      ),
    );
  }

  function handleDeleteAlarm(id: string) {
    setAlarms((current) => current.filter((alarm) => alarm.id !== id));
  }

  return (
    <div>
      {ringingAlarm ? (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        >
          <span>
            Alarm: {ringingAlarm.label || formatAlarmTime(ringingAlarm.time)}
          </span>
          <Button
            type="button"
            variant="danger"
            className="px-2 py-1"
            onClick={() => setRingingAlarm(null)}
          >
            Dismiss
          </Button>
        </div>
      ) : null}

      <form onSubmit={handleAddAlarm} className="flex flex-wrap gap-2">
        <label htmlFor="alarm-time" className="sr-only">
          Alarm time
        </label>
        <input
          id="alarm-time"
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
        />

        <label htmlFor="alarm-label" className="sr-only">
          Alarm label
        </label>
        <input
          id="alarm-label"
          type="text"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Label (optional)"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
        />

        <Button type="submit">Add</Button>
      </form>

      <div className="thin-scrollbar mt-4 max-h-[280px] space-y-2 overflow-y-auto pr-1">
        {alarms.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No alarms yet. Set one above.
          </p>
        ) : (
          alarms
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((alarm) => (
              <div
                key={alarm.id}
                className={`flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950 ${alarm.enabled ? "" : "opacity-60"
                  }`}
              >
                <div className="min-w-0">
                  <span className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                    {formatAlarmTime(alarm.time)}
                  </span>
                  {alarm.label ? (
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {alarm.label}
                    </span>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-3 py-1 text-xs"
                    onClick={() => handleToggleAlarm(alarm.id)}
                  >
                    {alarm.enabled ? "On" : "Off"}
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    className="px-2 py-1"
                    aria-label={`Delete alarm ${formatAlarmTime(alarm.time)}`}
                    onClick={() => handleDeleteAlarm(alarm.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default AlarmPanel;
