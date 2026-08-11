"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  DEFAULT_THEME_KEY,
  buildThemeVars,
  isThemeKey,
  nextTimeKey,
  resolveInitialThemeKey,
  toTimeState,
  type ThemeKey,
  type TimeState,
} from "@/lib/theme";
import Nav from "./Nav";
import Footer from "./Footer";

interface ThemeContextValue extends TimeState {
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within SiteChrome");
  }
  return ctx;
}

function applyThemeVars(timeKey: ThemeKey) {
  const vars = buildThemeVars(timeKey);
  const root = document.documentElement;
  Object.entries(vars).forEach(([prop, value]) => root.style.setProperty(prop, value));
  root.setAttribute("data-time", timeKey);
}

function resolveClientTheme(): ThemeKey {
  // Prefer what the blocking boot script already painted.
  const boot = document.documentElement.getAttribute("data-time");
  if (isThemeKey(boot)) return boot;
  return resolveInitialThemeKey({
    prefersDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
  });
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    skipTransition: () => void;
  };
};

function runThemeTransition(apply: () => void, transitioningRef: { current: boolean }) {
  const doc = document as ViewTransitionDoc;
  if (typeof doc.startViewTransition === "function") {
    transitioningRef.current = true;
    const transition = doc.startViewTransition(apply);
    transition.finished.finally(() => {
      transitioningRef.current = false;
    });
    return;
  }
  apply();
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  // Same initial state on server + first client paint (avoids hydration mismatch).
  // Boot script already painted the live palette; we sync React state after mount
  // without a view transition so flower assets catch up quietly.
  const [state, setState] = useState<TimeState>(() => toTimeState(DEFAULT_THEME_KEY));
  const timeKeyRef = useRef<ThemeKey>(DEFAULT_THEME_KEY);
  const transitioningRef = useRef(false);

  useEffect(() => {
    const key = resolveClientTheme();
    applyThemeVars(key);
    if (key !== timeKeyRef.current) {
      timeKeyRef.current = key;
      setState(toTimeState(key));
    }
  }, []);

  const cycleTheme = useCallback(() => {
    if (transitioningRef.current) return;

    const next = toTimeState(nextTimeKey(timeKeyRef.current));

    runThemeTransition(() => {
      flushSync(() => {
        timeKeyRef.current = next.timeKey;
        applyThemeVars(next.timeKey);
        setState(next);
      });
    }, transitioningRef);
  }, []);

  const value = useMemo(() => ({ ...state, cycleTheme }), [state, cycleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <div className="siteShell">
        <Nav />
        <main className="siteMain">{children}</main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}
