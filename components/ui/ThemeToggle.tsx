"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Light/dark toggle.
 *
 * The theme lives on the `<html data-theme>` attribute, written by the
 * pre-paint inline script in `app/layout.tsx` (so there is no flash) and by
 * this toggle. `useSyncExternalStore` subscribes to that attribute, which
 * keeps the component free of state-setting effects and stays correct under
 * React's concurrent rendering.
 */

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  // Light is the site's default. Dark only applies when the reader has
  // chosen it — the OS preference is intentionally not consulted.
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export default function ThemeToggle({
  labelLight = "Switch to light theme",
  labelDark = "Switch to dark theme",
}: {
  labelLight?: string;
  labelDark?: string;
}) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("eh-theme", next);
    } catch {
      // Private mode / storage disabled — the toggle still works for this session.
    }
    listeners.forEach((cb) => cb());
  }, []);

  const isDark = theme === "dark";
  const label = isDark ? labelLight : labelDark;

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={label}
      title={label}
      id="theme-toggle"
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
