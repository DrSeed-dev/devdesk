import Card from "./components/ui/Card";
import ThemeToggle from "./components/ui/ThemeToggle";
import { useTheme } from "./hooks/useTheme";
import ClockWidget from "./components/widgets/ClockWidget";
import TodoWidget from "./components/widgets/TodoWidget";
import QuoteWidget from "./components/widgets/QuoteWidget";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 transition dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
              Developer Productivity Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              DevDesk
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              A focused workspace for your daily tools, tasks, notes, and
              developer flow.
            </p>
          </div>

          <ThemeToggle theme={theme} onToggleTheme={toggleTheme} />
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card title="Clock" description="Track your current local time.">
           <ClockWidget />
          </Card>

          <Card title="Weather" description="Check your local conditions.">
            <p>Weather widget will go here.</p>
          </Card>

          <Card title="Todos" description="Manage your current tasks.">
           <TodoWidget />
          </Card>

          <Card title="Notes" description="Keep quick thoughts nearby.">
            <p>Sticky notes widget will go here.</p>
          </Card>

          <Card title="GitHub" description="View your developer profile.">
            <p>GitHub profile widget will go here.</p>
          </Card>

          <Card title="Quote" description="Get a small programming      prompt.">
           <QuoteWidget />
          </Card>


        </section>
      </div>
    </main>
  );
}

export default App;