import classes from "./Header.module.css";

const Header = (props) => {
  return (
    <header className={classes.header}>
      <h1>
        <span className={classes.ikea}>IKEA</span> DE / PL Preisvergleich
      </h1>
    </header>
  );
};

export default Header;
