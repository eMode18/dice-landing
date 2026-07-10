import { useEffect, useState } from "react";

const STORAGE_KEY = "dice-theme";

function getInitialTheme(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    // Suppress every element's own hover/transition rules for one frame so
    // the light/dark swap itself is instant, without having to strip
    // transition-colors from every component (which would also kill their
    // normal hover transitions).
    root.classList.add("theme-transitioning");
    root.classList.toggle("dark", isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    const id = requestAnimationFrame(() => root.classList.remove("theme-transitioning"));
    return () => cancelAnimationFrame(id);
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}
