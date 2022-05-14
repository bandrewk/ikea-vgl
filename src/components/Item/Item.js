import classes from "./Item.module.css";

const Item = (props) => {
  // Display article id separated by a dot like ikea does
  const articleId = `${props.item.id}`.match(/.{1,3}/g).join(".");

  if (props.item.notFoundDE) {
    return (
      <div className={classes.itemContainer}>
        <p>{props.item.id}</p>
        <p>Artikel nicht gefunden ! </p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p
          className={classes.removeBtn}
          onClick={() => props.removeItemHandler(props.item.key)}
        >
          ❌
        </p>
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

  const appliedClasses = `${classes.itemContainer} ${
    !props.item.cheaperInPLN ? classes.expensive : classes.cheap
  }`;

  return (
    <div className={appliedClasses}>
      <p>{articleId}</p>
      <p>{itemName}</p>
      <p>€ {props.item.priceDE}</p>
      <p>{pricePLNInEur}</p>
      <p>{props.item.discountInPercentage} %</p>
      <p>{props.item.cheaperInPLN ? "🟢" : "🔴"}</p>

      <p
        className={classes.removeBtn}
        onClick={() => props.removeItemHandler(props.item.key)}
      >
        ❌
      </p>
    </div>
  );
};

export default Item;
