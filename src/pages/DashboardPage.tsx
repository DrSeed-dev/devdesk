import {
  Clock as ClockIcon,
  CloudSun,
  GitFork,
  ListTodo,
  NotebookPen,
  Users,
} from "lucide-react";
import {
  ContactCount,
  GithubHandle,
  NoteCount,
  OpenTaskCount,
  WeatherCity,
} from "../components/layout/PanelMeta";
import Panel from "../components/ui/Panel";
import ClockWidget from "../components/widgets/ClockWidget";
import ContactsWidget from "../components/widgets/ContactsWidget";
import GithubProfileWidget from "../components/widgets/GithubProfileWidget";
import NotesWidget from "../components/widgets/NotesWidget";
import TodoWidget from "../components/widgets/TodoWidget";
import WeatherWidget from "../components/widgets/WeatherWidget";

function DashboardPage() {
  return (
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
  );
}

export default DashboardPage;
