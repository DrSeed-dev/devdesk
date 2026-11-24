import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useNow } from "../../hooks/useNow";
import { countDueContacts } from "../../lib/contacts";
import { toDateKey } from "../../lib/followUp";
import { STORAGE_KEYS } from "../../lib/storageKeys";
import type { Contact } from "../../types/contact";

type StoredTodo = { isCompleted: boolean };
type StoredItem = { id: string };

export function OpenTaskCount() {
  const [todos] = useLocalStorage<StoredTodo[]>(STORAGE_KEYS.todos, []);
  const openCount = todos.filter((todo) => !todo.isCompleted).length;

  return <>{openCount} open</>;
}

export function NoteCount() {
  const [notes] = useLocalStorage<StoredItem[]>(STORAGE_KEYS.notes, []);

  return <>{notes.length} saved</>;
}

export function ContactCount() {
  const [contacts] = useLocalStorage<Contact[]>(STORAGE_KEYS.contacts, []);
  const now = useNow(60_000);
  const dueCount = countDueContacts(contacts, toDateKey(now));

  return (
    <>
      {contacts.length} saved{dueCount > 0 ? ` · ${dueCount} due` : ""}
    </>
  );
}

export function WeatherCity() {
  const [city] = useLocalStorage(STORAGE_KEYS.weatherCity, "Lagos");

  return <>{city}</>;
}

export function GithubHandle() {
  const [username] = useLocalStorage(STORAGE_KEYS.githubUsername, "octocat");

  return <>@{username}</>;
}