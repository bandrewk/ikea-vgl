import classes from "./Footer.module.css";
import metadata from "./../../metadata.json";

const Footer = (props) => {
  let version;
  if (metadata.buildTag.length > 1)
    version = `Version ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`;
  else {
    version = `Version ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision}`;
  }

  return (
    <footer className="container">
      <div className={classes.footer}>
        <p className={classes["footer--text"]}>
          {version}. &copy; Copyright 2022 bandrewk.
          <a
            href="https://github.com/bandrewk/ikea-vgl"
            rel="noreferrer"
            target="_blank"
          >
            OpenSource project
          </a>{" "}
          ❤️
        </p>
        <p
          className={`${classes["footer--text"]} ${classes["footer--text--btn"]}`}
          onClick={() => {
            props.loadDemoHandler();
          }}
        >
          Click here to load demo content.
        </p>

        <br />
        <p className={classes["footer--text"]}>
          <span>Notice of Non-Affiliation and Disclaimer </span>
        </p>
        <p className={classes["footer--text"]}>
          We are not affiliated, associated, authorized, endorsed by, or in any
          way officially connected with IKEA Deutschland GmbH & Co. KG, or any
          of its subsidiaries or its affiliates. The official IKEA Deutschland
          GmbH & Co. KG website can be found at https://www.ikea.de. The name
          IKEA as well as related names, marks, emblems and images are
          registered trademarks of their respective owners.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
