import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AlarmWatcher from "./components/layout/AlarmWatcher";
import AppShell from "./components/layout/AppShell";
import TabTitle from "./components/layout/TabTitle";
import { TOOLS } from "./components/tools/toolRegistry";
import { ToastProvider } from "./context/ToastContext";
import { useTheme } from "./hooks/useTheme";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ToolsPage from "./pages/ToolsPage";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <ToastProvider>
        <TabTitle />
        <AlarmWatcher />

        <AppShell theme={theme} onToggleTheme={toggleTheme}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/tools"
              element={<Navigate to={`/tools/${TOOLS[0].id}`} replace />}
            />
            <Route path="/tools/:toolId" element={<ToolsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
