import {
  Clock as ClockIcon,
  CloudSun,
  GitFork,
  ListTodo,
  NotebookPen,
  Users,
} from "lucide-react";
import AlarmWatcher from "./components/layout/AlarmWatcher";
import CodeBackground from "./components/layout/CodeBackground";
import Sidebar from "./components/layout/Sidebar";
import StatusBar from "./components/layout/StatusBar";
import TabTitle from "./components/layout/TabTitle";
import TopBar from "./components/layout/TopBar";
import {
  ContactCount,
  GithubHandle,
  NoteCount,
  OpenTaskCount,
  WeatherCity,
} from "./components/layout/PanelMeta";
import Panel from "./components/ui/Panel";
import ClockWidget from "./components/widgets/ClockWidget";
import ContactsWidget from "./components/widgets/ContactsWidget";
import GithubProfileWidget from "./components/widgets/GithubProfileWidget";
import NotesWidget from "./components/widgets/NotesWidget";
import TodoWidget from "./components/widgets/TodoWidget";
import WeatherWidget from "./components/widgets/WeatherWidget";
import { ToastProvider } from "./context/ToastContext";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToastProvider>
      <TabTitle />
      <AlarmWatcher />

      <div className="app-background relative flex min-h-screen text-slate-950 dark:text-slate-100 lg:h-dvh lg:overflow-hidden">
        <CodeBackground />

        <Sidebar />

        <div className="relative z-10 flex min-w-0 flex-1 flex-col lg:min-h-0">
          <TopBar theme={theme} onToggleTheme={toggleTheme} />

          <main className="flex flex-1 flex-col p-3 lg:min-h-0">
            <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)]">
              <div className="flex flex-col gap-3 lg:min-h-0">
                <Panel
                  id="panel-tasks"
                  title="Tasks"
                  icon={ListTodo}
                  meta={<OpenTaskCount />}
                  className="lg:flex-1"
                >
                  <TodoWidget />
                </Panel>

                <Panel
                  id="panel-github"
                  title="GitHub"
                  icon={GitFork}
                  meta={<GithubHandle />}
                  scroll
                  className="lg:flex-1"
                >
                  <GithubProfileWidget />
                </Panel>
              </div>

              <div className="flex flex-col gap-3 lg:min-h-0">
                <Panel
                  id="panel-notes"
                  title="Notes"
                  icon={NotebookPen}
                  meta={<NoteCount />}
                  className="lg:flex-[1.3]"
                >
                  <NotesWidget />
                </Panel>

                <Panel
                  id="panel-people"
                  title="People"
                  icon={Users}
                  meta={<ContactCount />}
                  className="lg:flex-1"
                >
                  <ContactsWidget />
                </Panel>
              </div>

              <div className="flex flex-col gap-3 lg:min-h-0">
                <Panel
                  id="panel-clock"
                  title="Clock"
                  icon={ClockIcon}
                  scroll
                  className="lg:flex-[0.9]"
                >
                  <ClockWidget />
                </Panel>

                <Panel
                  id="panel-weather"
                  title="Weather"
                  icon={CloudSun}
                  meta={<WeatherCity />}
                  scroll
                  className="lg:flex-[1.1]"
                >
                  <WeatherWidget />
                </Panel>
              </div>
            </div>
          </main>

          <StatusBar />
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;