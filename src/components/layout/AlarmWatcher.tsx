import { useCallback, useEffect, useRef, useState } from "react";
import { BellRing } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  showAlarmNotification,
  startAlarmSound,
  unlockAlarmAudio,
  vibrateDevice,
} from "../../lib/alarmAlerts";
import {
  findDueAlarms,
  formatAlarmTime,
  type StoredAlarm,
} from "../../lib/alarmTime";
import { STORAGE_KEYS } from "../../lib/storageKeys";
import Button from "../ui/Button";

const CHECK_EVERY_MS = 1000;
const MAX_LATE_MS = 10 * 60 * 1000;
const SNOOZE_MS = 5 * 60 * 1000;

type Snooze = {
  alarms: StoredAlarm[];
  until: number;
};

function describeAlarm(alarm: StoredAlarm) {
  return alarm.label || formatAlarmTime(alarm.time);
}

// Lives at the top of the app, so alarms keep ringing no matter which panel
// or Clock tab you are looking at. It also shows the ringing banner.
function AlarmWatcher() {
  const [alarms] = useLocalStorage<StoredAlarm[]>(STORAGE_KEYS.alarms, []);
  const [ringing, setRinging] = useState<StoredAlarm[]>([]);

  const lastCheckRef = useRef(new Date());
  const snoozeRef = useRef<Snooze | null>(null);
  const stopSoundRef = useRef<(() => void) | null>(null);

  const ring = useCallback((due: StoredAlarm[]) => {
    setRinging((current) => [
      ...current,
      ...due.filter((alarm) => !current.some((item) => item.id === alarm.id)),
    ]);

    stopSoundRef.current?.();
    stopSoundRef.current = startAlarmSound();
    vibrateDevice();

    showAlarmNotification(
      "DevDesk alarm",
      due.map(describeAlarm).join(" · "),
    );
  }, []);

  function stopRinging() {
    stopSoundRef.current?.();
    stopSoundRef.current = null;
    setRinging([]);
  }

  function handleSnooze() {
    snoozeRef.current = { alarms: ringing, until: Date.now() + SNOOZE_MS };
    stopRinging();
  }

  // Checks once a second, and again the moment you return to the tab.
  useEffect(() => {
    function check() {
      const now = new Date();
      const due = findDueAlarms(alarms, lastCheckRef.current, now, MAX_LATE_MS);
      lastCheckRef.current = now;

      if (due.length > 0) {
        ring(due);
      }

      const snooze = snoozeRef.current;

      if (snooze && now.getTime() >= snooze.until) {
        snoozeRef.current = null;
        ring(snooze.alarms);
      }
    }

    const intervalId = window.setInterval(check, CHECK_EVERY_MS);
    document.addEventListener("visibilitychange", check);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", check);
    };
  }, [alarms, ring]);

  // Sound is only allowed after the first touch of the page, so unlock it
  // on the first click or key press.
  useEffect(() => {
    window.addEventListener("pointerdown", unlockAlarmAudio, { once: true });
    window.addEventListener("keydown", unlockAlarmAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAlarmAudio);
      window.removeEventListener("keydown", unlockAlarmAudio);
    };
  }, []);

  useEffect(() => {
    return () => stopSoundRef.current?.();
  }, []);

  if (ringing.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-14 z-[70] flex justify-center px-4"
    >
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-2xl dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
        <BellRing size={18} className="shrink-0" aria-hidden="true" />

        <p className="min-w-0 flex-1 truncate font-bold">
          {ringing.map(describeAlarm).join(" · ")}
        </p>

        <Button
          type="button"
          variant="ghost"
          className="px-3 py-1 text-xs"
          onClick={handleSnooze}
        >
          Snooze 5 min
        </Button>
        <Button
          type="button"
          className="px-3 py-1 text-xs"
          onClick={stopRinging}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}

export default AlarmWatcher;