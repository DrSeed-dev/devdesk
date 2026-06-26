import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { Todo } from "../../types/todo";

const TODOS_STORAGE_KEY = "devdesk-todos";

function TodoWidget() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(TODOS_STORAGE_KEY, []);
  const [todoTitle, setTodoTitle] = useState("");

  function handleAddTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((currentTodos) => [newTodo, ...currentTodos]);
    setTodoTitle("");
  }

  function handleToggleTodo(todoId: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, completed: !todo.completed }
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
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          placeholder="Add a task..."
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />

        <button
          type="submit"
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Add
        </button>
      </form>

      <ul className="mt-4 space-y-3">
        {todos.length === 0 ? (
          <li className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No tasks yet.
          </li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="h-4 w-4 rounded border-slate-300"
              />

              <span
                className={`min-w-0 flex-1 text-sm ${
                  todo.completed
                    ? "text-slate-400 line-through"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {todo.title}
              </span>

              <button
                type="button"
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-sm font-medium text-rose-500 transition hover:text-rose-600"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TodoWidget;