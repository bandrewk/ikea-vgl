import classes from "./Header.module.css";

const Header = (props) => {
  const styles = `${classes.header} container grid`;
  return (
    <header className={styles}>
      <h1 className="heading-primary">
        IKEA &#127465;&#127466; / &#127477;&#127473; Preisvergleich
      </h1>
    </header>
  );
};

export default Header;
