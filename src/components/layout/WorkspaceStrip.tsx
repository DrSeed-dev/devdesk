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
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
      {stats.map((stat, index) => (
        <span
          key={stat}
          className={
            index < stats.length - 1
              ? "border-r border-slate-200 pr-4 dark:border-slate-800"
              : ""
          }
        >
          {stat}
        </span>
      ))}
    </div>
  );
}

export default WorkspaceStrip;
