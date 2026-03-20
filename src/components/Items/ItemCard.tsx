import { X, ExternalLink, AlertTriangle } from "lucide-react";
import type { IkeaItem } from "../../types/item";
import classes from "./ItemCard.module.css";

interface ItemCardProps {
  item: IkeaItem;
  onRemove: (key: string) => void;
}

function formatArticleId(id: string) {
  return id.match(/.{1,3}/g)?.join(".") ?? id;
}

function formatPrice(price: number) {
  return price.toFixed(2);
}

export default function ItemCard({ item, onRemove }: ItemCardProps) {
  const articleId = formatArticleId(item.id);

  if (item.retired) {
    return (
      <div className={`${classes.card} ${classes.cardDisabled}`}>
        <div className={classes.cardHeader}>
          <span className={classes.articleId}>{articleId}</span>
          <button
            className={classes.removeBtn}
            onClick={() => onRemove(item.key)}
            aria-label="Artikel entfernen"
          >
            <X size={16} />
          </button>
        </div>
        <p className={classes.title}>{item.name}</p>
        <div className={classes.statusBadge}>
          <AlertTriangle size={14} />
          Nicht mehr verfügbar
        </div>
      </div>
    );
  }

  if (item.notFoundDE) {
    return (
      <div className={`${classes.card} ${classes.cardDisabled}`}>
        <div className={classes.cardHeader}>
          <span className={classes.articleId}>{articleId}</span>
          <button
            className={classes.removeBtn}
            onClick={() => onRemove(item.key)}
            aria-label="Artikel entfernen"
          >
            <X size={16} />
          </button>
        </div>
        <p className={classes.title}>Artikel nicht gefunden!</p>
      </div>
    );
  }

  const discountLabel = `${Math.abs(item.discountInPercentage).toFixed(1)}%`;
  const isCheaper = item.cheaperInPLN;
  const badgeClass = isCheaper ? classes.badgeSaving : classes.badgeExpensive;

  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <span className={classes.articleId}>{articleId}</span>
        {!item.notFoundPL && (
          <span className={`${classes.badge} ${badgeClass}`}>
            {isCheaper ? "−" : "+"}
            {discountLabel}
          </span>
        )}
        <button
          className={classes.removeBtn}
          onClick={() => onRemove(item.key)}
          aria-label="Artikel entfernen"
        >
          <X size={16} />
        </button>
      </div>

      <p className={classes.title}>
        {item.url ? (
          <a
            href={`${item.url}?ref=ikeadeplvgl`}
            target="_blank"
            rel="noreferrer"
            className={classes.titleLink}
          >
            {item.name} <ExternalLink size={12} />
          </a>
        ) : (
          item.name
        )}
      </p>

      <div className={classes.prices}>
        <div className={classes.priceRow}>
          <span className={classes.priceLabel}>🇩🇪 DE</span>
          <span className={classes.priceValue}>€ {formatPrice(item.priceDE)}</span>
        </div>
        <div className={classes.priceRow}>
          <span className={classes.priceLabel}>🇵🇱 PL</span>
          <span className={classes.priceValue}>
            {item.notFoundPL
              ? "Nicht gefunden"
              : `€ ${formatPrice(item.pricePLNInEur)}`}
          </span>
        </div>
        {item.pricePLN > 0 && (
          <div className={classes.priceRow}>
            <span className={classes.priceLabel}></span>
            <span className={classes.priceSub}>
              ({formatPrice(item.pricePLN)} PLN)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
