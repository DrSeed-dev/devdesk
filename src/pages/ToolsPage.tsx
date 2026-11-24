import { NavLink, Navigate, useParams } from "react-router-dom";
import { TOOLS } from "../components/tools/toolRegistry";
import Panel from "../components/ui/Panel";

function ToolsPage() {
  const { toolId } = useParams();
  const tool = TOOLS.find((item) => item.id === toolId);

  // An unknown address like /tools/nothing goes to the first tool.
  if (!tool) {
    return <Navigate to={`/tools/${TOOLS[0].id}`} replace />;
  }

  const ToolScreen = tool.component;

  return (
    <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[13rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
      <nav
        aria-label="Developer tools"
        className="thin-scrollbar flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:pb-0"
      >
        {TOOLS.map(({ id, name, icon: Icon }) => (
          <NavLink
            key={id}
            to={`/tools/${id}`}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isActive
                  ? "border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  : "border-transparent text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-slate-100"
              }`
            }
          >
            <Icon size={16} aria-hidden="true" />
            {name}
          </NavLink>
        ))}
      </nav>

      <Panel
        key={tool.id}
        title={tool.name}
        icon={tool.icon}
        scroll
        className="lg:min-h-0"
      >
        <ToolScreen />
      </Panel>
    </div>
  );
}

export default ToolsPage;
