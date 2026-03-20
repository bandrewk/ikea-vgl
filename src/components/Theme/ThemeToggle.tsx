import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import classes from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={classes.toggle}
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Dunkles Design aktivieren" : "Helles Design aktivieren"
      }
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
