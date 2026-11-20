import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import {
  requestAlarmNotificationPermission,
  unlockAlarmAudio,
} from "../../../lib/alarmAlerts";
import { formatAlarmTime, type StoredAlarm } from "../../../lib/alarmTime";
import { STORAGE_KEYS } from "../../../lib/storageKeys";
import Button from "../../ui/Button";

// This panel only manages the list of alarms. The ringing itself is handled
// by AlarmWatcher, which is always running, so alarms still go off when this
// tab isn't the one on screen.
function AlarmPanel() {
  const [alarms, setAlarms] = useLocalStorage<StoredAlarm[]>(
    STORAGE_KEYS.alarms,
    [],
  );
  const [time, setTime] = useState("07:00");
  const [label, setLabel] = useState("");

  function handleAddAlarm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!time) {
      return;
    }

    setAlarms((current) => [
      ...current,
      { id: crypto.randomUUID(), time, label: label.trim(), enabled: true },
    ]);
    setLabel("");

    // Adding an alarm is a click, which is exactly when the browser allows
    // sound and the notification permission prompt.
    unlockAlarmAudio();
    requestAlarmNotificationPermission();
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
    <div className="flex min-h-0 flex-1 flex-col">
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

      <div className="thin-scrollbar mt-4 max-h-72 min-h-0 space-y-2 overflow-y-auto pr-1 lg:max-h-none lg:flex-1">
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
                className={`flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950 ${
                  alarm.enabled ? "" : "opacity-60"
                }`}
              >
                <div className="min-w-0">
                  <span className="block text-base font-bold text-slate-900 dark:text-slate-100">
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

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Alarms ring while DevDesk is open in any browser tab, even in the
        background.
      </p>
    </div>
  );
}

export default AlarmPanel;