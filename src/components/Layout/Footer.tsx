import { Github, RefreshCw } from "lucide-react";
import { APP_VERSION } from "../../config/metadata";
import classes from "./Footer.module.css";

interface FooterProps {
  exchangeRate: number;
  onLoadDemo: () => void;
}

export default function Footer({ exchangeRate, onLoadDemo }: FooterProps) {
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
        </div>
        <div className={classes.right}>
          <button className={classes.demoBtn} onClick={onLoadDemo}>
            Demo laden
          </button>
        </div>
      </div>
    </footer>
  );
}
