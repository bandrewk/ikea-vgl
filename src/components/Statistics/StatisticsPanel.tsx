import { TrendingDown, ArrowRight } from "lucide-react";
import type { Statistics } from "../../types/item";
import classes from "./StatisticsPanel.module.css";

interface StatisticsPanelProps {
  stats: Statistics;
}

export default function StatisticsPanel({ stats }: StatisticsPanelProps) {
  if (stats.totalItems === 0) return null;

  return (
    <div className={classes.panel}>
      <div className={classes.header}>
        <div className={classes.iconWrap}>
          <TrendingDown size={18} />
        </div>
        <span className={classes.label}>Ersparnis</span>
      </div>

      <div className={classes.hero}>
        <span className={classes.heroValue}>€ {stats.totalDiscount.toFixed(2)}</span>
        <span className={classes.heroPct}>
          {stats.totalDiscountInPercentage.toFixed(1)}%
        </span>
      </div>

      <div className={classes.comparison}>
        <div className={classes.store}>
          <span className={classes.storeFlag}>🇩🇪</span>
          <span className={classes.storePrice}>€ {stats.totalPriceDE.toFixed(2)}</span>
        </div>
        <ArrowRight size={14} className={classes.arrow} />
        <div className={classes.store}>
          <span className={classes.storeFlag}>🇵🇱</span>
          <span className={classes.storePrice}>€ {stats.totalPricePLEur.toFixed(2)}</span>
        </div>
      </div>

      <div className={classes.count}>
        {stats.totalItems} {stats.totalItems === 1 ? "Produkt" : "Produkte"}
      </div>
    </div>
  );
}
