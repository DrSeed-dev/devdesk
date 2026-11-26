import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AlarmWatcher from "./components/layout/AlarmWatcher";
import AppShell from "./components/layout/AppShell";
import TabTitle from "./components/layout/TabTitle";
import { TOOLS } from "./components/tools/toolRegistry";
import { ToastProvider } from "./context/ToastContext";
import { useAppearance } from "./hooks/useAppearance";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import SettingsPage from "./pages/SettingsPage";
import ToolsPage from "./pages/ToolsPage";

function App() {
  const { mode, toggleMode } = useAppearance();

  return (
    <BrowserRouter>
      <ToastProvider>
        <TabTitle />
        <AlarmWatcher />

        <AppShell theme={mode} onToggleTheme={toggleMode}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/tools"
              element={<Navigate to={`/tools/${TOOLS[0].id}`} replace />}
            />
            <Route path="/tools/:toolId" element={<ToolsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
