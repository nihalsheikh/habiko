import {
  createContext,
  useContext,
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { flushSync } from "react-dom";
import type {
  Theme,
  ThemeContextType,
  ThemeProviderProps,
} from "../types/context";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setInternalTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const applyThemeWithTransition = async (
    nextThemeOrUpdater: Theme | ((prev: Theme) => Theme),
    event?: ReactMouseEvent | MouseEvent,
  ): Promise<void> => {
    const resolvedNextTheme: Theme =
      typeof nextThemeOrUpdater === "function"
        ? nextThemeOrUpdater(theme)
        : nextThemeOrUpdater;

    if (resolvedNextTheme === theme) return;

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInternalTheme(resolvedNextTheme);
      return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (event) {
      const target = event.currentTarget as HTMLElement | null;
      if (target && "getBoundingClientRect" in target) {
        const rect = target.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else if (event.clientX && event.clientY) {
        x = event.clientX;
        y = event.clientY;
      }
    }

    const right = window.innerWidth - x;
    const bottom = window.innerHeight - y;
    const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setInternalTheme(resolvedNextTheme);
      });
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
        fill: "forwards",
      },
    );
  };

  const toggle = (event?: ReactMouseEvent | MouseEvent) => {
    const next = theme === "dark" ? "light" : "dark";
    return applyThemeWithTransition(next, event);
  };

  const setTheme = (
    nextTheme: Theme | ((prev: Theme) => Theme),
    event?: ReactMouseEvent | MouseEvent,
  ) => {
    return applyThemeWithTransition(nextTheme, event);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
