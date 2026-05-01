"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const ORDER = ["light", "dark", "system"] as const;
type ThemeName = (typeof ORDER)[number];

const ICONS: Record<ThemeName, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

const LABELS: Record<ThemeName, string> = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
};

function isThemeName(value: string | undefined): value is ThemeName {
  return value === "light" || value === "dark" || value === "system";
}

const noopSubscribe = () => () => {};
const trueOnClient = () => true;
const falseOnServer = () => false;

/**
 * Returns `false` during SSR and the first client render, `true` thereafter.
 * Lets us render a stable theme placeholder for hydration without using
 * `useEffect` + `setState`.
 */
function useHasMounted() {
  return useSyncExternalStore(noopSubscribe, trueOnClient, falseOnServer);
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();
  const current: ThemeName = mounted && isThemeName(theme) ? theme : "system";
  const Icon = ICONS[current];
  const label = LABELS[current];

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
    if (next) setTheme(next);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={cycle}
      aria-label={`Switch theme (currently ${label.toLowerCase()})`}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
