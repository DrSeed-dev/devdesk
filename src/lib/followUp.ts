export type FollowUpTone = "overdue" | "today" | "soon" | "later";

export type FollowUpStatus = {
  label: string;
  tone: FollowUpTone;
};

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);

  if (!match) {
    return null;
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

  return Number.isNaN(date.getTime()) ? null : date;
}

export function getFollowUpStatus(
  followUpOn: string | undefined,
  today: Date,
): FollowUpStatus | null {
  if (!followUpOn) {
    return null;
  }

  const target = parseDateKey(followUpOn);

  if (!target) {
    return null;
  }

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const days = Math.round(
    (target.getTime() - startOfToday.getTime()) / 86_400_000,
  );

  if (days < 0) return { label: `Overdue ${-days}d`, tone: "overdue" };
  if (days === 0) return { label: "Follow up today", tone: "today" };
  if (days === 1) return { label: "Tomorrow", tone: "soon" };
  if (days <= 7) return { label: `In ${days} days`, tone: "soon" };

  return {
    label: new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(target),
    tone: "later",
  };
}
