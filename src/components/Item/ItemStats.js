import classes from "./ItemStats.module.css";

const ItemStats = (props) => {
  if (props.stats.totalItems === 0) return;
  return (
    <>
      <h2>Statistik</h2>
      <hr />
      <h3>Gesamtpreis</h3>
      <div>
        <div className={classes.itemStatsElementContainer}>
          <p className={classes.itemStatsElementLeft}>Deutschland</p>
          <p className={classes.itemStatsElementRight}>
            € {props.stats.totalPriceDE}
          </p>
        </div>
        <div className={classes.itemStatsElementContainer}>
          <p className={classes.itemStatsElementLeft}>Polen</p>
          <p className={classes.itemStatsElementRight}>
            € {props.stats.totalPricePLEur}
          </p>
        </div>
        <div className={classes.itemStatsElementContainer}>
          <p className={classes.itemStatsElementLeft}>Gesamtrabatt</p>
          <p className={classes.itemStatsElementRight}>
            {props.stats.totalDiscountInPercentage} %
          </p>
        </div>

        <h3>Sonstiges</h3>
        <div className={classes.itemStatsElementContainer}>
          <p className={classes.itemStatsElementLeft}>Produkte</p>
          <p className={classes.itemStatsElementRight}>
            {props.stats.totalItems} Stk.
          </p>
        </div>
      </div>
      <br />
      <h2>Ersparnis</h2>
      <hr />
      <p className={classes.savings}>€ {props.stats.totalDiscount}</p>
    </>
  );
};

export default ItemStats;
