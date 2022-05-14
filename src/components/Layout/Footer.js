import classes from "./Footer.module.css";
import metadata from "./../../metadata.json";

const Footer = (props) => {
  return (
    <footer className={classes.footer}>
      <p>{`Version ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`}</p>
      <p>
        © Copyright 2022 bandrewk.{" "}
        <a
          href="https://github.com/bandrewk/ikea-vgl"
          rel="noreferrer"
          target="_blank"
        >
          OpenSource
        </a>{" "}
        ❤️
      </p>
      <p>
        <b>Notice of Non-Affiliation and Disclaimer</b>{" "}
      </p>
      <p>
        We are not affiliated, associated, authorized, endorsed by, or in any
        way officially connected with IKEA Deutschland GmbH & Co. KG, or any of
        its subsidiaries or its affiliates. The official IKEA Deutschland GmbH &
        Co. KG website can be found at https://www.ikea.de. The name IKEA as
        well as related names, marks, emblems and images are registered
        trademarks of their respective owners.
      </p>
    </footer>
  );
};

export default Footer;
