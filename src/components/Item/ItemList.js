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
        <div className={classes.heading}>
          <p className={`heading-tertiary ${classes["remove-margin"]} `}>
            Artikelliste
          </p>
          <button
            className="btn--icon"
            onClick={() => {
              props.removeItemHandler(null);
            }}
          >
            <ion-icon name="trash-bin-outline"></ion-icon>
          </button>
        </div>

        <div className="grid grid--3-cols margin-top-sm grid--gap-sm">
          {displayItems.length === 0 && (
            <p className={classes["section-list--no-entries"]}>
              Keine Einträge vorhanden. Füge deinen ersten Artikel in der
              Eingabe hinzu.
            </p>
          )}
          {displayItems}
        </div>
      </div>
    </section>
  );
};

export default ItemList;
