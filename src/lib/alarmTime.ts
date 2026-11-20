export type StoredAlarm = {
  id: string;
  time: string; // 24-hour "HH:MM", matches <input type="time">
  label: string;
  enabled: boolean;
};

export function formatAlarmTime(time: string) {
  const [hourStr, minuteStr] = time.split(":");
  const reference = new Date();
  reference.setHours(Number(hourStr), Number(minuteStr), 0, 0);

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(reference);
}

// Finds alarms whose time fell between the last check and now.
//
// Looking at the gap since the last check (instead of "is it exactly this
// minute right now?") means an alarm still rings when the browser slows down
// timers in a background tab or the laptop was briefly asleep. Alarms more
// than `maxLateMs` late are skipped so an old alarm doesn't ring hours later.
// Yesterday is checked too, so an alarm at 12:00 AM isn't missed at midnight.
export function findDueAlarms(
  alarms: StoredAlarm[],
  lastCheck: Date,
  now: Date,
  maxLateMs: number,
): StoredAlarm[] {
  return alarms.filter((alarm) => {
    if (!alarm.enabled) {
      return false;
    }

    const [hours, minutes] = alarm.time.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return false;
    }

    return [0, -1].some((dayOffset) => {
      const occurrence = new Date(now);
      occurrence.setDate(occurrence.getDate() + dayOffset);
      occurrence.setHours(hours, minutes, 0, 0);

      return (
        occurrence > lastCheck &&
        occurrence <= now &&
        now.getTime() - occurrence.getTime() <= maxLateMs
      );
    });
  });
}