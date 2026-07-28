import {
  Clock as ClockIcon,
  CloudSun,
  GitFork,
  ListTodo,
  NotebookPen,
  Quote as QuoteIcon,
  Users,
} from "lucide-react";
import CodeBackground from "./components/layout/CodeBackground";
import DashboardHeader from "./components/layout/DashboardHeader";
import WorkspaceStrip from "./components/layout/WorkspaceStrip";
import Card from "./components/ui/Card";
import ClockWidget from "./components/widgets/ClockWidget";
import ContactsWidget from "./components/widgets/ContactsWidget";
import GithubProfileWidget from "./components/widgets/GithubProfileWidget";
import NotesWidget from "./components/widgets/NotesWidget";
import QuoteWidget from "./components/widgets/QuoteWidget";
import TodoWidget from "./components/widgets/TodoWidget";
import WeatherWidget from "./components/widgets/WeatherWidget";
import { useTheme } from "./hooks/useTheme";
import { ToastProvider } from "./context/ToastContext";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToastProvider>
      <main className="app-background relative min-h-screen overflow-hidden text-slate-950 transition dark:text-slate-100">
        <CodeBackground />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <DashboardHeader theme={theme} onToggleTheme={toggleTheme} />

          <WorkspaceStrip />

          <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            <Card
              title="Clock"
              description="Time and alarms."
              icon={ClockIcon}
              className="animate-fade-in-up"
              style={{ animationDelay: "0ms" }}
            >
              <ClockWidget />
            </Card>

            <Card
              title="Weather"
              description="Check your local conditions."
              icon={CloudSun}
              className="animate-fade-in-up"
              style={{ animationDelay: "60ms" }}
            >
              <WeatherWidget />
            </Card>

            <Card
              title="Todos"
              description="Manage your current tasks."
              icon={ListTodo}
              className="animate-fade-in-up"
              style={{ animationDelay: "120ms" }}
            >
              <TodoWidget />
            </Card>

            <Card
              title="Notes"
              description="Keep quick thoughts nearby."
              icon={NotebookPen}
              className="animate-fade-in-up"
              style={{ animationDelay: "180ms" }}
            >
              <NotesWidget />
            </Card>

            <Card
              title="GitHub"
              description="View your developer profile."
              icon={GitFork}
              className="animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <GithubProfileWidget />
            </Card>

            <Card
              title="Contacts"
              description="People worth remembering."
              icon={Users}
              className="animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <ContactsWidget />
            </Card>

            <Card
              title="Quote"
              description="Get a small programming prompt."
              icon={QuoteIcon}
              className="animate-fade-in-up"
              style={{ animationDelay: "360ms" }}
            >
              <QuoteWidget />
            </Card>
          </section>
        </div>
      </main>
    </ToastProvider>
  );
}

export default App;
