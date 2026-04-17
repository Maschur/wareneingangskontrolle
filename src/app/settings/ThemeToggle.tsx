"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-between w-full bg-white border border-gray-100 rounded-xl px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{theme === "dark" ? "🌙" : "☀️"}</span>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {theme === "dark" ? "Dunkler Modus" : "Heller Modus"}
          </p>
          <p className="text-xs text-gray-500">
            {theme === "dark" ? "Dunklere Farben für die Augen" : "Standard helle Oberfläche"}
          </p>
        </div>
      </div>
      <div className={`w-12 h-7 rounded-full p-0.5 transition-colors ${theme === "dark" ? "bg-magenta" : "bg-gray-300"}`}>
        <div className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
      </div>
    </button>
  );
}
