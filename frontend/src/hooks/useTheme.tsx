import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ThemeContextValue = {
  dark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => localStorage.getItem("swasthya-theme") === "dark");

  useEffect(() => {
    const theme = dark ? "dark" : "light";
    localStorage.setItem("swasthya-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [dark]);

  return <ThemeContext.Provider value={{ dark, toggleTheme: () => setDark((value) => !value) }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
