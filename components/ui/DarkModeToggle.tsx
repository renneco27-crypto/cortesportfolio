"use client";
import { Moon, Sun } from "lucide-react";
import { useThemeHook } from "@/hooks/useTheme";

export function DarkModeToggle() {
  const { theme, toggleTheme } = useThemeHook();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="text-zinc-500 hover:text-zinc-900 transition-colors duration-200 dark:text-zinc-400 dark:hover:text-white"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
