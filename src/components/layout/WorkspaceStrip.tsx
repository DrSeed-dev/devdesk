import { useLocalStorage } from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../lib/storageKeys";

// Minimal shapes — this component only reads one field from each,
// so it doesn't need to depend on each widget's full type definition.
type StoredTodo = { isCompleted: boolean };
type StoredNote = { id: string };

function WorkspaceStrip() {
  const [todos] = useLocalStorage<StoredTodo[]>(STORAGE_KEYS.todos, []);
  const [notes] = useLocalStorage<StoredNote[]>(STORAGE_KEYS.notes, []);
  const [city] = useLocalStorage(STORAGE_KEYS.weatherCity, "Lagos");
  const [githubUsername] = useLocalStorage(
    STORAGE_KEYS.githubUsername,
    "octocat",
  );

  const activeTasks = todos.filter((todo) => !todo.isCompleted).length;

  const stats = [
    `${activeTasks} active task${activeTasks === 1 ? "" : "s"}`,
    `${notes.length} note${notes.length === 1 ? "" : "s"}`,
    `Weather in ${city}`,
    `@${githubUsername}`,
  ];

  return (
    <div className="hidden items-center gap-x-4 text-xs font-medium text-slate-600 dark:text-slate-300 lg:flex">
      {stats.map((stat, index) => (
        <span
          key={stat}
          className={
            index < stats.length - 1
              ? "whitespace-nowrap border-r border-slate-200 pr-4 dark:border-slate-800"
              : "whitespace-nowrap"
          }
        >
          {stat}
        </span>
      ))}
    </div>
  );
}

export default WorkspaceStrip;