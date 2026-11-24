import type { Contact } from "../types/contact";

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return Array.from(parts[0]).slice(0, 2).join("").toUpperCase();
  }

  const first = Array.from(parts[0])[0];
  const last = Array.from(parts[parts.length - 1])[0];

  return `${first}${last}`.toUpperCase();
}

export const AVATAR_COLOR_COUNT = 6;

// The same name always gets the same colour, so people are easy to recognise.
export function avatarColorIndex(name: string): number {
  let hash = 0;

  for (const char of name.toLowerCase()) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  }

  return hash % AVATAR_COLOR_COUNT;
}

export function filterContacts(contacts: Contact[], query: string): Contact[] {
  const search = query.trim().toLowerCase();

  if (!search) {
    return contacts;
  }

  return contacts.filter((contact) =>
    [contact.name, contact.role, contact.company ?? "", contact.note].some(
      (field) => field.toLowerCase().includes(search),
    ),
  );
}

function isDue(contact: Contact, todayKey: string) {
  return Boolean(contact.followUpOn) && (contact.followUpOn as string) <= todayKey;
}

// People whose follow-up is due go first (oldest first), everyone else keeps
// their order, so the people who need a message are always at the top.
export function sortContacts(contacts: Contact[], todayKey: string): Contact[] {
  const due = contacts
    .filter((contact) => isDue(contact, todayKey))
    .sort((a, b) => (a.followUpOn as string).localeCompare(b.followUpOn as string));
  const rest = contacts.filter((contact) => !isDue(contact, todayKey));

  return [...due, ...rest];
}

export function countDueContacts(contacts: Contact[], todayKey: string): number {
  return contacts.filter((contact) => isDue(contact, todayKey)).length;
}
