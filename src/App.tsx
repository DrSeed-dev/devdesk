import {
  Clock as ClockIcon,
  CloudSun,
  GitFork,
  ListTodo,
  NotebookPen,
  Quote as QuoteIcon,
} from "lucide-react";
import DashboardHeader from "./components/layout/DashboardHeader";
import Card from "./components/ui/Card";
import StatCard from "./components/ui/StatCard";
import ClockWidget from "./components/widgets/ClockWidget";
import GithubProfileWidget from "./components/widgets/GithubProfileWidget";
import NotesWidget from "./components/widgets/NotesWidget";
import QuoteWidget from "./components/widgets/Quotewidget";
import TodoWidget from "./components/widgets/TodoWidget";
import WeatherWidget from "./components/widgets/WeatherWidget";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 transition dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <DashboardHeader theme={theme} onToggleTheme={toggleTheme} />

        <section
          aria-label="Workspace summary"
          className="mt-5 grid gap-4 sm:grid-cols-3"
        >
          <StatCard
            label="Workspace"
            value="6 widgets"
            helperText="Clock, weather, todos, notes, GitHub, and quotes."
          />

          <StatCard
            label="Persistence"
            value="Local-first"
            helperText="Theme, tasks, notes, city, and GitHub user stay saved."
          />

          <StatCard
            label="Responsive"
            value="Mobile ready"
            helperText="Single-column on phones, expanded grid on larger screens."
          />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          <Card
            title="Clock"
            description="Track your current local time."
            icon={ClockIcon}
          >
            <ClockWidget />
          </Card>

          <Card
            title="Weather"
            description="Check your local conditions."
            icon={CloudSun}
          >
            <WeatherWidget />
          </Card>

          <Card
            title="Todos"
            description="Manage your current tasks."
            icon={ListTodo}
          >
            <TodoWidget />
          </Card>

          <Card
            title="Notes"
            description="Keep quick thoughts nearby."
            icon={NotebookPen}
          >
            <NotesWidget />
          </Card>

          <Card
            title="GitHub"
            description="View your developer profile."
            icon={GitFork}
          >
            <GithubProfileWidget />
          </Card>

          <Card
            title="Quote"
            description="Get a small programming prompt."
            icon={QuoteIcon}
          >
            <QuoteWidget />
          </Card>
        </section>
      </div>
    </main>
  );
}

export default App;