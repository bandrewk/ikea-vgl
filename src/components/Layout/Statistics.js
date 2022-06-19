import classes from "./Statistics.module.css";

const Statistics = (props) => {
  if (props.stats.totalItems === 0) return;

  return (
    <section class={classes["section-statistics"]}>
      <div class="container">
        <p class="heading-tertiary">Statistik</p>
        <div>
          <ul class={classes["stats-list"]}>
            <li class={classes["stats-list--item"]}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span>
                Gesamtersparnis: <span>€ {props.stats.totalDiscount}</span> (
                {props.stats.totalDiscountInPercentage}%)
              </span>
            </li>
            <li class={classes["stats-list--item"]}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span>
                Gesamtpreis (&#127465;&#127466;):{" "}
                <span>€ {props.stats.totalPriceDE}</span>
              </span>
            </li>
            <li class={classes["stats-list--item"]}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span>
                Gesamtpreis (&#127477;&#127473;):{" "}
                <span>€ {props.stats.totalPricePLEur}</span>
              </span>
            </li>
            <li class={classes["stats-list--item"]}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span>Anzahl an Produkten: {props.stats.totalItems} Stück</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
