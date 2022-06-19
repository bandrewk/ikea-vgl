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
    // <ul>
    //   <li>
    //     <div className={classes.itemContainerHeader}>
    //       <p>Artikel-Nr.</p>
    //       <p>Name</p>
    //       <p>DE</p>
    //       <p>PLN</p>
    //       <p>Rabatt</p>
    //       <p>Status</p>
    //       <p></p>
    //     </div>
    //   </li>
    //   {displayItems.length === 0 && (
    //     <p style={{ marginLeft: "1rem" }}>
    //       Keine Einträge vorhanden. Füge deinen ersten Artikel in der Eingabe
    //       hinzu. 😊
    //     </p>
    //   )}
    //   {displayItems}
    // </ul>
  );
};

export default ItemList;
