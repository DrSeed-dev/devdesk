import { Palette } from "lucide-react";
import ThemeCard from "../components/settings/ThemeCard";
import Button from "../components/ui/Button";
import Panel from "../components/ui/Panel";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useAppearance } from "../hooks/useAppearance";
import { DARK_THEMES, LIGHT_THEMES, type Mode } from "../lib/themes";

const MODES: { id: Mode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

function SettingsPage() {
  const {
    appearance,
    setMode,
    selectDarkTheme,
    selectLightTheme,
    resetThemes,
  } = useAppearance();

  return (
    <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      <Panel
        title="Appearance"
        icon={Palette}
        scroll
        className="lg:min-h-0 lg:flex-1"
      >
        <div className="space-y-8 pb-2">
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Mode
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Pick light or dark. The button in the top bar switches between
                them too.
              </p>
            </div>
            <SegmentedControl
              items={MODES}
              activeId={appearance.mode}
              onChange={setMode}
            />
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Dark themes
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Pick one to try it. DevDesk switches to dark mode so you see it
                right away.
              </p>
            </div>
            <div
              role="group"
              aria-label="Dark themes"
              className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              {DARK_THEMES.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  selected={appearance.darkTheme === theme.id}
                  onSelect={() => selectDarkTheme(theme.id)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Light themes
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Pick one to try it. DevDesk switches to light mode so you see it
                right away.
              </p>
            </div>
            <div
              role="group"
              aria-label="Light themes"
              className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            >
              {LIGHT_THEMES.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  selected={appearance.lightTheme === theme.id}
                  onSelect={() => selectLightTheme(theme.id)}
                />
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your choices are saved on this device.
            </p>
            <Button type="button" variant="ghost" onClick={resetThemes}>
              Reset themes
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}

export default SettingsPage;
