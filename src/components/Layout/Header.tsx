import ThemeToggle from "../Theme/ThemeToggle";
import classes from "./Header.module.css";

export default function Header() {
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <div className={classes.brand}>
          <div className={classes.logo}>
            <span className={classes.logoIcon}>I</span>
          </div>
          <div>
            <h1 className={classes.title}>Preisvergleich</h1>
            <p className={classes.subtitle}>IKEA Deutschland vs. Polen</p>
          </div>
        </div>
        <div className={classes.flags}>
          <span>🇩🇪</span>
          <span className={classes.vs}>vs</span>
          <span>🇵🇱</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
