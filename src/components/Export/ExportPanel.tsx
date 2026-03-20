import { useRef } from "react";
import { Upload, FileSpreadsheet, FileText, Download } from "lucide-react";
import type { IkeaItem, Statistics } from "../../types/item";
import {
  exportToCSV,
  exportToExcel,
  importFromCSV,
  importFromExcel,
} from "./exportUtils";
import classes from "./ExportPanel.module.css";

interface ExportPanelProps {
  items: IkeaItem[];
  stats: Statistics;
  onImport: (items: IkeaItem[]) => void;
}

export default function ExportPanel({
  items,
  stats,
  onImport,
}: ExportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = file.name.endsWith(".xlsx")
        ? await importFromExcel(file)
        : await importFromCSV(file);
      onImport(imported);
    } catch {
      alert("Fehler beim Importieren der Datei.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className={classes.section}>
      <p className={classes.label}>
        {items.length > 0 ? <Download size={14} /> : <Upload size={14} />}
        {items.length > 0 ? " Export / Import" : " Import"}
      </p>
      <div className={classes.buttons}>
        {items.length > 0 && (
          <>
            <button
              className={classes.btn}
              onClick={() => exportToCSV(items, stats)}
            >
              <FileText size={15} />
              CSV
            </button>
            <button
              className={classes.btn}
              onClick={() => exportToExcel(items, stats)}
            >
              <FileSpreadsheet size={15} />
              Excel
            </button>
          </>
        )}
        <button
          className={`${classes.btn} ${classes.btnSecondary}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={15} />
          Importieren
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx"
          onChange={handleImport}
          className={classes.hiddenInput}
        />
      </div>
    </section>
  );
}
