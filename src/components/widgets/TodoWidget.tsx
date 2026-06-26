import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

type Todo = {
  id: string;
  title: string;
  isCompleted: boolean;
};

const STORAGE_KEY = "devdesk-todos";

function createTodo(title: string): Todo {
  return {
    id: crypto.randomUUID(),
    title,
    isCompleted: false,
  };
}

function TodoWidget() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, []);
  const [taskTitle, setTaskTitle] = useState("");

  function handleAddTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = taskTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    setTodos((currentTodos) => [...currentTodos, createTodo(trimmedTitle)]);
    setTaskTitle("");
  }

  function handleToggleTodo(todoId: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo,
      ),
    );
  }

  function handleDeleteTodo(todoId: string) {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    );
  }

  return (
    <div>
      <form onSubmit={handleAddTodo} className="flex gap-2">
        <input
          type="text"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Add a task..."
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
        />

        <button
          type="submit"
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Add
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {todos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No tasks yet. Add one to start your flow.
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-950"
            >
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => handleToggleTodo(todo.id)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600"
              />

              <p
                className={`min-w-0 flex-1 text-sm ${
                  todo.isCompleted
                    ? "text-slate-400 line-through"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {todo.title}
              </p>

              <button
                type="button"
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-sm font-medium text-rose-600 transition hover:text-rose-700"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodoWidget;