import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle Theme"
      className="p-2 rounded-full hover:bg-accent transition"
    >
      {isDark ? (
        <SunMedium className="w-5 h-5 text-yellow-400" />
      ) : (
        <MoonStar className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
}
