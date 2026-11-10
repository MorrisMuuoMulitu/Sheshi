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
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  // The OS preference can change while the page is open.
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  mq?.addEventListener?.("change", cb);
  return () => {
    listeners.delete(cb);
    mq?.removeEventListener?.("change", cb);
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
