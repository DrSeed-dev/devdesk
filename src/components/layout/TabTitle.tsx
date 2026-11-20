import { useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../lib/storageKeys";

type StoredTodo = { isCompleted: boolean };

// Shows how many tasks are still open in the browser tab, like "(3) DevDesk",
// so you can see it even when DevDesk is in a background tab.
function TabTitle() {
  const [todos] = useLocalStorage<StoredTodo[]>(STORAGE_KEYS.todos, []);
  const openCount = todos.filter((todo) => !todo.isCompleted).length;

  useEffect(() => {
    document.title = openCount > 0 ? `(${openCount}) DevDesk` : "DevDesk";
  }, [openCount]);

  return null;
}

export default TabTitle;