import classes from "./Item.module.css";

const Item = (props) => {
  // Display article id separated by a dot like ikea does
  const articleId = `${props.item.id}`.match(/.{1,3}/g).join(".");

  if (props.item.notFoundDE) {
    return (
      <div className={classes.item}>
        <p className={classes["item--articleNumber"]}>{articleId}</p>
        <p className={classes["item--title"]}>Artikel nicht gefunden!</p>

        <button
          className={classes["item--btn-remove"]}
          onClick={(e) => {
            e.preventDefault();
            props.removeItemHandler(props.item.key);
          }}
        >
          <ion-icon name="close-circle-outline"></ion-icon>
        </button>
      </div>
    );
  }

  const itemName =
    props.item.url.length > 0 ? (
      <a
        href={`${props.item.url}?ref=ikeadeplvgl`}
        target="_blank"
        rel="noreferrer"
      >
        {props.item.name}
      </a>
    ) : (
      props.item.name
    );

  const pricePLNInEur = props.item.notFoundPL
    ? "Artikel nicht gefunden."
    : `€ ${props.item.pricePLNInEur}`;

  return (
    <div className={classes.item}>
      <p className={classes["item--articleNumber"]}>{articleId}</p>
      <p className={classes["item--title"]}>{itemName}</p>
      <p className={classes["item--price"]}>
        &#127465;&#127466;: <span>€ {props.item.priceDE}</span>{" "}
        &#127477;&#127473;:
        <span> {pricePLNInEur}</span>
      </p>
      <p
        className={`${classes["item--discount"]} ${
          props.item.cheaperInPLN ? "" : classes["expensive"]
        }`}
      >
        {props.item.discountInPercentage} %
      </p>

      <button
        className={classes["item--btn-remove"]}
        onClick={(e) => {
          e.preventDefault();
          props.removeItemHandler(props.item.key);
        }}
      >
        <ion-icon name="close-circle-outline"></ion-icon>
      </button>
    </div>
  );
};

export default Item;
