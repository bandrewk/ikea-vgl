import classes from "./Statistics.module.css";

const Statistics = (props) => {
  if (props.stats.totalItems === 0) return;

  return (
    <section className={classes["section-statistics"]}>
      <div className="container">
        <p className="heading-tertiary">Statistik</p>
        <div>
          <ul className={classes["stats-list"]}>
            <li className={classes["stats-list--item"]}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span>
                Gesamtersparnis: <span>€ {props.stats.totalDiscount}</span> (
                {props.stats.totalDiscountInPercentage}%)
              </span>
            </li>
            <li className={classes["stats-list--item"]}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span>
                Gesamtpreis (&#127465;&#127466;):{" "}
                <span>€ {props.stats.totalPriceDE}</span>
              </span>
            </li>
            <li className={classes["stats-list--item"]}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span>
                Gesamtpreis (&#127477;&#127473;):{" "}
                <span>€ {props.stats.totalPricePLEur}</span>
              </span>
            </li>
            <li className={classes["stats-list--item"]}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span>
                Anzahl an Produkten: <span>{props.stats.totalItems} Stück</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
