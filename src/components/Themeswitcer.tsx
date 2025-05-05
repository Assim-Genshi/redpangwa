import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const ThemeSwitcher: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <Button
      onPress={() => setIsDarkMode((prev) => !prev)}
      isIconOnly
      className="bg-base-300 hover:bg-base-200 text-base-content"
      variant="flat"
      radius="full"
      startContent={
        isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />
      }
    />
  );
};

export default ThemeSwitcher;
