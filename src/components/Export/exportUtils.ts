import type { IkeaItem, Statistics } from "../../types/item";

function formatArticleId(id: string) {
  return id.match(/.{1,3}/g)?.join(".") ?? id;
}

export function exportToCSV(items: IkeaItem[], stats: Statistics): void {
  const headers = [
    "Artikelnummer",
    "Name",
    "Menge",
    "Preis DE (EUR)",
    "Preis PL (PLN)",
    "Preis PL (EUR)",
    "Gesamt DE (EUR)",
    "Gesamt PL (EUR)",
    "Rabatt %",
    "URL",
  ];

  const rows = items.map((item) => [
    formatArticleId(item.id),
    `"${item.name.replace(/"/g, '""')}"`,
    String(item.qty),
    item.priceDE.toFixed(2),
    item.pricePLN.toFixed(2),
    item.pricePLNInEur.toFixed(2),
    (item.priceDE * item.qty).toFixed(2),
    (item.pricePLNInEur * item.qty).toFixed(2),
    item.discountInPercentage.toFixed(2),
    item.url || "",
  ]);

  // Add stats section
  rows.push([]);
  rows.push(["Statistik"]);
  rows.push(["Gesamtpreis DE (EUR)", stats.totalPriceDE.toFixed(2)]);
  rows.push(["Gesamtpreis PL (EUR)", stats.totalPricePLEur.toFixed(2)]);
  rows.push(["Gesamtersparnis (EUR)", stats.totalDiscount.toFixed(2)]);
  rows.push([
    "Gesamtersparnis (%)",
    stats.totalDiscountInPercentage.toFixed(2),
  ]);
  rows.push(["Anzahl Produkte", String(stats.totalItems)]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, "ikea-preisvergleich.csv");
}

const EXCEL_HEADERS = [
  "Artikelnummer",
  "Name",
  "Menge",
  "Preis DE (EUR)",
  "Preis PL (PLN)",
  "Preis PL (EUR)",
  "Gesamt DE (EUR)",
  "Gesamt PL (EUR)",
  "Rabatt %",
  "URL",
] as const;

export async function exportToExcel(
  items: IkeaItem[],
  stats: Statistics
): Promise<void> {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");

  const headerRow = EXCEL_HEADERS.map((value) => ({
    value,
    type: String,
    fontWeight: "bold" as const,
  }));

  const itemRows = items.map((item) => [
    { value: formatArticleId(item.id), type: String },
    { value: item.name, type: String },
    { value: item.qty, type: Number },
    { value: item.priceDE, type: Number },
    { value: item.pricePLN, type: Number },
    { value: item.pricePLNInEur, type: Number },
    { value: Math.round(item.priceDE * item.qty * 100) / 100, type: Number },
    {
      value: Math.round(item.pricePLNInEur * item.qty * 100) / 100,
      type: Number,
    },
    { value: item.discountInPercentage, type: Number },
    { value: item.url || "", type: String },
  ]);

  const statsRows: [string, number][] = [
    ["Gesamtpreis DE (EUR)", stats.totalPriceDE],
    ["Gesamtpreis PL (EUR)", stats.totalPricePLEur],
    ["Gesamtersparnis (EUR)", stats.totalDiscount],
    ["Gesamtersparnis (%)", stats.totalDiscountInPercentage],
    ["Anzahl Produkte", stats.totalItems],
  ];

  const file = await writeXlsxFile([
    {
      sheet: "Produkte",
      data: [headerRow, ...itemRows],
    },
    {
      sheet: "Statistik",
      data: [
        [
          { value: "Statistik", type: String, fontWeight: "bold" as const },
          { value: "Wert", type: String, fontWeight: "bold" as const },
        ],
        ...statsRows.map(([label, value]) => [
          { value: label, type: String },
          { value, type: Number },
        ]),
      ],
    },
  ]);

  downloadBlob(await file.toBlob(), "ikea-preisvergleich.xlsx");
}

export function importFromCSV(file: File): Promise<IkeaItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split("\n");
        const items: IkeaItem[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line.trim() || line.startsWith("Statistik")) break;

          const cols = parseCSVLine(line);
          if (cols.length < 6) continue;

          const id = cols[0].replace(/\./g, "");
          const qty = parseInt(cols[2]) || 1;
          const priceDE = parseFloat(cols[3]) || 0;
          const pricePLN = parseFloat(cols[4]) || 0;
          const pricePLNInEur = parseFloat(cols[5]) || 0;
          const discountInPercentage = parseFloat(cols[8]) || 0;

          items.push({
            key: Math.random().toString(),
            id,
            name: cols[1].replace(/^"|"$/g, ""),
            qty,
            priceDE,
            pricePLN,
            pricePLNInEur,
            discountInPercentage,
            cheaperInPLN: discountInPercentage <= 0,
            url: cols[9] || "",
            notFoundDE: priceDE === 0,
            notFoundPL: pricePLNInEur === 0,
            retired: false,
          });
        }
        resolve(items);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function importFromExcel(file: File): Promise<IkeaItem[]> {
  // `readSheet` reads the first sheet; the default export returns every sheet.
  const { readSheet } = await import("read-excel-file/browser");
  const sheet = await readSheet(file);

  // Map by header name so files exported by older versions keep working,
  // whatever order the columns happen to be in.
  const [headerRow, ...bodyRows] = sheet;
  const headers = headerRow.map((cell) => String(cell ?? "").trim());
  const rows = bodyRows.map((cells) =>
    Object.fromEntries(headers.map((header, i) => [header, cells[i]]))
  );

  return rows.map((row) => {
    const priceDE = Number(row["Preis DE (EUR)"]) || 0;
    const pricePLNInEur = Number(row["Preis PL (EUR)"]) || 0;
    const discountInPercentage = Number(row["Rabatt %"]) || 0;
    const id = String(row["Artikelnummer"] || "").replace(/\./g, "");

    return {
      key: Math.random().toString(),
      id,
      name: String(row["Name"] || ""),
      qty: Number(row["Menge"]) || 1,
      priceDE,
      pricePLN: Number(row["Preis PL (PLN)"]) || 0,
      pricePLNInEur,
      discountInPercentage,
      cheaperInPLN: discountInPercentage <= 0,
      url: String(row["URL"] || ""),
      notFoundDE: priceDE === 0,
      notFoundPL: pricePLNInEur === 0,
      retired: false,
    };
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
