import { Github, RefreshCw } from "lucide-react";
import { APP_VERSION } from "../../config/metadata";
import classes from "./Footer.module.css";

interface FooterProps {
  exchangeRate: number;
  onLoadDemo: () => boolean;
  onLoadKitchen: () => boolean;
}

const WARN_MSG = "Bitte zuerst alle Artikel löschen, um die Demo zu laden.";

export default function Footer({ exchangeRate, onLoadDemo, onLoadKitchen }: FooterProps) {
  const handleDemo = () => {
    if (!onLoadDemo()) alert(WARN_MSG);
  };

  const handleKitchen = () => {
    if (!onLoadKitchen()) alert(WARN_MSG);
  };

  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <div className={classes.left}>
          <span className={classes.tag}>v{APP_VERSION}</span>
          <span className={classes.sep}>&middot;</span>
          <span className={classes.rate}>
            <RefreshCw size={10} /> 1 EUR = {exchangeRate} PLN
          </span>
          <span className={classes.sep}>&middot;</span>
          <a
            href="https://github.com/bandrewk/ikea-vgl"
            target="_blank"
            rel="noreferrer"
            className={classes.link}
          >
            <Github size={12} /> GitHub
          </a>
          <span className={classes.sep}>&middot;</span>
          <span className={classes.copy}>&copy; 2022–2026 bandrewk</span>
        </div>
        <div className={classes.right}>
          <button className={classes.demoBtn} onClick={handleDemo}>
            Demo laden
          </button>
          <button className={classes.kitchenBtn} onClick={handleKitchen}>
            Beispielküche 🍳
          </button>
        </div>
      </div>
    </footer>
  );
}
