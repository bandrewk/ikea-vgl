import classes from "./ItemList.module.css";
import Item from "./Item";

const ItemList = (props) => {
  const displayItems = props.items.map((item) => {
    return (
      <Item
        item={item}
        key={item.key}
        removeItemHandler={props.removeItemHandler}
      />
    );
  });

  return (
    <section className={classes["section-list"]}>
      <div className="container">
        <p className="heading-tertiary">Artikelliste</p>

        <div className="grid grid--3-cols margin-top-sm grid--gap-sm">
          {displayItems}
        </div>
      </div>
    </section>
  );
};

export default ItemList;
