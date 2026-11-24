import type { ReactNode } from "react";
import CodeBackground from "./CodeBackground";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";
import TopBar from "./TopBar";

type AppShellProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  children: ReactNode;
};

// The frame around every page: side rail, top bar, status bar and the
// background. The page itself goes in the middle.
function AppShell({ theme, onToggleTheme, children }: AppShellProps) {
  return (
    <div className="app-background relative flex min-h-screen text-slate-950 dark:text-slate-100 lg:h-dvh lg:overflow-hidden">
      <CodeBackground />

      <Sidebar />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col lg:min-h-0">
        <TopBar theme={theme} onToggleTheme={onToggleTheme} />

        <main className="flex flex-1 flex-col p-3 lg:min-h-0">{children}</main>

        <StatusBar />
      </div>
    </div>
  );
}

export default AppShell;
