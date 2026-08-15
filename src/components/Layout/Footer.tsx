import { RefreshCw } from "lucide-react";
import { APP_VERSION } from "../../config/metadata";
import classes from "./Footer.module.css";

interface FooterProps {
  exchangeRate: number;
  onLoadDemo: () => boolean;
  onLoadKitchen: () => boolean;
}

// lucide dropped its brand icons in v1, so the GitHub mark is inlined here.
function GithubIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58l-.01-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.82 1.1.82 2.22l-.01 3.29c0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
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
      <p className={classes.disclaimer}>
        Dieses Projekt steht in keiner Verbindung zur IKEA Deutschland GmbH &amp; Co. KG. IKEA ist
        eine eingetragene Marke der jeweiligen Rechteinhaber.
      </p>
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
            <GithubIcon size={12} /> GitHub
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
