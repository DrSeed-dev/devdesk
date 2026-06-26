import Card from "./components/ui/Card";
import ThemeToggle from "./components/ui/ThemeToggle";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 transition dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-sky-600 dark:text-sky-400">
              Developer Productivity Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold">DevDesk</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
              A focused dashboard for your daily developer workflow.
            </p>
          </div>

          <ThemeToggle theme={theme} onToggleTheme={toggleTheme} />
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card title="Clock">
            <p>Live clock widget will go here.</p>
          </Card>

          <Card title="Weather">
            <p>Weather widget will go here.</p>
          </Card>

          <Card title="Todos">
            <p>Todo list widget will go here.</p>
          </Card>

          <Card title="Notes">
            <p>Sticky notes widget will go here.</p>
          </Card>

          <Card title="GitHub">
            <p>GitHub profile widget will go here.</p>
          </Card>

          <Card title="Quote">
            <p>Programming quote widget will go here.</p>
          </Card>
        </section>
      </div>
    </main>
  );
}

export default App;