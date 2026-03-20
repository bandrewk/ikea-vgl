import { useState, useMemo } from "react";
import { Trash2, ArrowUpDown } from "lucide-react";
import type { IkeaItem } from "../../types/item";
import ItemCard from "./ItemCard";
import classes from "./ItemGrid.module.css";

type SortOption = "added" | "discount-desc" | "discount-asc" | "price-desc" | "price-asc" | "name";

const sortLabels: Record<SortOption, string> = {
  added: "Hinzugefügt",
  "discount-desc": "Rabatt ↓",
  "discount-asc": "Rabatt ↑",
  "price-desc": "Preis DE ↓",
  "price-asc": "Preis DE ↑",
  name: "Name A–Z",
};

function sortItems(items: IkeaItem[], sort: SortOption): IkeaItem[] {
  if (sort === "added") return items;
  const sorted = [...items];
  switch (sort) {
    case "discount-desc":
      return sorted.sort((a, b) => b.discountInPercentage - a.discountInPercentage);
    case "discount-asc":
      return sorted.sort((a, b) => a.discountInPercentage - b.discountInPercentage);
    case "price-desc":
      return sorted.sort((a, b) => b.priceDE - a.priceDE);
    case "price-asc":
      return sorted.sort((a, b) => a.priceDE - b.priceDE);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "de"));
    default:
      return sorted;
  }
}

interface ItemGridProps {
  items: IkeaItem[];
  onRemoveItem: (key: string | null) => void;
  onUpdateQty: (key: string, delta: number) => void;
}

export default function ItemGrid({ items, onRemoveItem, onUpdateQty }: ItemGridProps) {
  const [sort, setSort] = useState<SortOption>("added");
  const sorted = useMemo(() => sortItems(items, sort), [items, sort]);

  return (
    <section className={classes.section}>
      <div className={classes.heading}>
        <h2 className={classes.title}>Artikelliste</h2>
        <div className={classes.actions}>
          {items.length > 1 && (
            <div className={classes.sortWrap}>
              <ArrowUpDown size={14} />
              <select
                className={classes.sortSelect}
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="Sortierung"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {items.length > 0 && (
            <button
              className={classes.clearBtn}
              onClick={() => onRemoveItem(null)}
              aria-label="Alle Artikel entfernen"
            >
              <Trash2 size={16} />
              Alle löschen
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className={classes.empty}>
          Keine Einträge vorhanden. Füge deinen ersten Artikel in der Eingabe
          hinzu.
        </p>
      ) : (
        <div className={classes.grid}>
          {sorted.map((item) => (
            <ItemCard
              key={item.key}
              item={item}
              onRemove={(key) => onRemoveItem(key)}
              onUpdateQty={onUpdateQty}
            />
          ))}
        </div>
      )}
    </section>
  );
}
