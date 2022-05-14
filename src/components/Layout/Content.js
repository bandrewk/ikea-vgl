import classes from "./Content.module.css";
import ItemList from "../Item/ItemList";

const Content = (props) => {
  return (
    <main className={classes.main}>
      <ItemList
        items={props.items}
        removeItemHandler={props.removeItemHandler}
      />
    </main>
  );
};

export default Content;
