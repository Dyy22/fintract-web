import { create } from "zustand";

type ThemeState = {
  isDark: boolean;
  toggle: () => void;
};

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("fintrack_theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

export const useThemeStore = create<ThemeState>((set) => {
  const initial = getInitialTheme();
  applyTheme(initial);

  return {
    isDark: initial,
    toggle: () =>
      set((state) => {
        const next = !state.isDark;
        localStorage.setItem("fintrack_theme", next ? "dark" : "light");
        applyTheme(next);
        return { isDark: next };
      }),
  };
});
