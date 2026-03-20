import { Trash2 } from "lucide-react";
import type { IkeaItem } from "../../types/item";
import ItemCard from "./ItemCard";
import classes from "./ItemGrid.module.css";

interface ItemGridProps {
  items: IkeaItem[];
  onRemoveItem: (key: string | null) => void;
}

export default function ItemGrid({ items, onRemoveItem }: ItemGridProps) {
  return (
    <section className={classes.section}>
      <div className={classes.heading}>
        <h2 className={classes.title}>Artikelliste</h2>
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

      {items.length === 0 ? (
        <p className={classes.empty}>
          Keine Einträge vorhanden. Füge deinen ersten Artikel in der Eingabe
          hinzu.
        </p>
      ) : (
        <div className={classes.grid}>
          {items.map((item) => (
            <ItemCard
              key={item.key}
              item={item}
              onRemove={(key) => onRemoveItem(key)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
