import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 rounded-full hover:bg-accent transition"
    >
      {theme === "dark" ? (
        <SunMedium className="w-5 h-5 text-yellow-400" />
      ) : (
        <MoonStar className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
}
