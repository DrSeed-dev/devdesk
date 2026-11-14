import { useLocalStorage } from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../lib/storageKeys";

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
  const [contacts] = useLocalStorage<StoredItem[]>(STORAGE_KEYS.contacts, []);

  return <>{contacts.length} saved</>;
}

export function WeatherCity() {
  const [city] = useLocalStorage(STORAGE_KEYS.weatherCity, "Lagos");

  return <>{city}</>;
}

export function GithubHandle() {
  const [username] = useLocalStorage(STORAGE_KEYS.githubUsername, "octocat");

  return <>@{username}</>;
}