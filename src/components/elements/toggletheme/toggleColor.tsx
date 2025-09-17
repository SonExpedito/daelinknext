'use client'
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/src/components/hooks/useTheme";

export default function ToggleTheme() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} aria-label="Trocar tema" className="p-2 cursor-pointer">
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}
