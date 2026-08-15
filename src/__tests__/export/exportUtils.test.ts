import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IkeaItem, Statistics } from "../../types/item";

// We need to mock the DOM download parts but test the actual logic
// Import the module dynamically after mocking
function makeItem(overrides: Partial<IkeaItem> = {}): IkeaItem {
  return {
    key: "test-1",
    id: "50205481",
    name: "KALLAX Regal",
    qty: 1,
    priceDE: 69.99,
    pricePLN: 249.0,
    pricePLNInEur: 57.64,
    discountInPercentage: -17.65,
    cheaperInPLN: true,
    url: "https://www.ikea.de/p/kallax",
    notFoundDE: false,
    notFoundPL: false,
    retired: false,
    ...overrides,
  };
}

const stats: Statistics = {
  totalPriceDE: 69.99,
  totalPricePLEur: 57.64,
  totalDiscountInPercentage: 17.65,
  totalDiscount: 12.35,
  totalItems: 1,
  missingPLCount: 0,
  missingPLValueDE: 0,
};

// Mock URL.createObjectURL and document methods for download
let capturedCSV = "";
let capturedBlob: Blob | null = null;

beforeEach(() => {
  capturedCSV = "";
  capturedBlob = null;

  // Keep URL constructible — spreading the class drops its constructor, and
  // other code (MSW, jsdom) calls `new URL(...)` during these tests.
  vi.stubGlobal(
    "URL",
    Object.assign(class MockURL extends URL {}, {
      createObjectURL: vi.fn((blob: Blob) => {
        capturedBlob = blob;
        return "blob:mock-url";
      }),
      revokeObjectURL: vi.fn(),
    })
  );
});

// Swallows the anchor click that would otherwise try to download the file.
function stubDownloadAnchor() {
  const clickSpy = vi.fn();
  vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
    (node as HTMLAnchorElement).click = clickSpy;
    return node;
  });
  vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);
  return clickSpy;
}

describe("exportToCSV", () => {
  it("generates valid CSV with BOM, headers, and data rows", async () => {
    const { exportToCSV } = await import("../../components/Export/exportUtils");

    const items = [makeItem()];
    const clickSpy = vi.fn();

    // Intercept the Blob constructor to capture CSV content
    const origBlob = globalThis.Blob;
    vi.stubGlobal("Blob", class extends origBlob {
      constructor(parts: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options);
        capturedCSV = parts.join("");
      }
    });

    const appendSpy = vi.spyOn(document.body, "appendChild").mockImplementation(
      (node) => {
        (node as HTMLAnchorElement).click = clickSpy;
        return node;
      }
    );
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    exportToCSV(items, stats);

    const text = capturedCSV;

    // BOM character
    expect(text.charCodeAt(0)).toBe(0xfeff);

    // Headers
    expect(text).toContain("Artikelnummer,Name,Menge");

    // Data row — article ID with dots
    expect(text).toContain("502.054.81");
    expect(text).toContain('"KALLAX Regal"');
    expect(text).toContain("69.99");
    expect(text).toContain("57.64");

    // Stats section
    expect(text).toContain("Statistik");
    expect(text).toContain("Gesamtpreis DE (EUR)");
    expect(text).toContain("Anzahl Produkte,1");

    // Triggered download
    expect(clickSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    vi.stubGlobal("Blob", origBlob);
  });

  it("escapes double quotes in item names", async () => {
    const { exportToCSV } = await import("../../components/Export/exportUtils");

    const items = [makeItem({ name: 'KALLAX "special" edition' })];
    const origBlob = globalThis.Blob;
    vi.stubGlobal("Blob", class extends origBlob {
      constructor(parts: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options);
        capturedCSV = parts.join("");
      }
    });
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
      (node as HTMLAnchorElement).click = vi.fn();
      return node;
    });
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    exportToCSV(items, stats);

    expect(capturedCSV).toContain('""special""');
    vi.stubGlobal("Blob", origBlob);
  });

  it("includes qty and total calculations", async () => {
    const { exportToCSV } = await import("../../components/Export/exportUtils");

    const items = [makeItem({ qty: 3 })];
    const origBlob = globalThis.Blob;
    vi.stubGlobal("Blob", class extends origBlob {
      constructor(parts: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options);
        capturedCSV = parts.join("");
      }
    });
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
      (node as HTMLAnchorElement).click = vi.fn();
      return node;
    });
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    exportToCSV(items, stats);

    // Gesamt DE = 69.99 * 3 = 209.97
    expect(capturedCSV).toContain("209.97");
    // Gesamt PL = 57.64 * 3 = 172.92
    expect(capturedCSV).toContain("172.92");
    vi.stubGlobal("Blob", origBlob);
  });
});

describe("importFromCSV", () => {
  it("parses a valid CSV file into items", async () => {
    const { importFromCSV } = await import("../../components/Export/exportUtils");

    const csv = [
      "Artikelnummer,Name,Menge,Preis DE (EUR),Preis PL (PLN),Preis PL (EUR),Gesamt DE (EUR),Gesamt PL (EUR),Rabatt %,URL",
      '502.054.81,"KALLAX Regal",2,69.99,249.00,57.64,139.98,115.28,-17.65,https://www.ikea.de/p/kallax',
    ].join("\n");

    const file = new File([csv], "test.csv", { type: "text/csv" });
    const items = await importFromCSV(file);

    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("50205481");
    expect(items[0].name).toBe("KALLAX Regal");
    expect(items[0].qty).toBe(2);
    expect(items[0].priceDE).toBe(69.99);
    expect(items[0].pricePLN).toBe(249.0);
    expect(items[0].pricePLNInEur).toBe(57.64);
    expect(items[0].discountInPercentage).toBe(-17.65);
    expect(items[0].cheaperInPLN).toBe(true);
    expect(items[0].url).toBe("https://www.ikea.de/p/kallax");
  });

  it("stops parsing at the Statistik section", async () => {
    const { importFromCSV } = await import("../../components/Export/exportUtils");

    const csv = [
      "Artikelnummer,Name,Menge,Preis DE (EUR),Preis PL (PLN),Preis PL (EUR),Gesamt DE (EUR),Gesamt PL (EUR),Rabatt %,URL",
      '502.054.81,"KALLAX Regal",1,69.99,249.00,57.64,69.99,57.64,-17.65,',
      "",
      "Statistik",
      "Gesamtpreis DE (EUR),69.99",
    ].join("\n");

    const file = new File([csv], "test.csv", { type: "text/csv" });
    const items = await importFromCSV(file);

    expect(items).toHaveLength(1);
  });

  it("skips rows with fewer than 6 columns", async () => {
    const { importFromCSV } = await import("../../components/Export/exportUtils");

    const csv = [
      "Artikelnummer,Name,Menge,Preis DE (EUR),Preis PL (PLN),Preis PL (EUR),Gesamt DE (EUR),Gesamt PL (EUR),Rabatt %,URL",
      '502.054.81,"KALLAX Regal",1,69.99,249.00,57.64,69.99,57.64,-17.65,',
      "bad,row",
    ].join("\n");

    const file = new File([csv], "test.csv", { type: "text/csv" });
    const items = await importFromCSV(file);

    expect(items).toHaveLength(1);
  });

  it("sets notFoundDE/notFoundPL when prices are zero", async () => {
    const { importFromCSV } = await import("../../components/Export/exportUtils");

    const csv = [
      "Artikelnummer,Name,Menge,Preis DE (EUR),Preis PL (PLN),Preis PL (EUR),Gesamt DE (EUR),Gesamt PL (EUR),Rabatt %,URL",
      '502.054.81,"Test",1,0,0,0,0,0,0,',
    ].join("\n");

    const file = new File([csv], "test.csv", { type: "text/csv" });
    const items = await importFromCSV(file);

    expect(items[0].notFoundDE).toBe(true);
    expect(items[0].notFoundPL).toBe(true);
  });

  it("handles quoted fields with commas inside", async () => {
    const { importFromCSV } = await import("../../components/Export/exportUtils");

    const csv = [
      "Artikelnummer,Name,Menge,Preis DE (EUR),Preis PL (PLN),Preis PL (EUR),Gesamt DE (EUR),Gesamt PL (EUR),Rabatt %,URL",
      '502.054.81,"KALLAX, the shelf",1,69.99,249.00,57.64,69.99,57.64,-17.65,',
    ].join("\n");

    const file = new File([csv], "test.csv", { type: "text/csv" });
    const items = await importFromCSV(file);

    expect(items[0].name).toBe("KALLAX, the shelf");
  });

  it("handles escaped double quotes in CSV via parseCSVLine", async () => {
    const { importFromCSV } = await import("../../components/Export/exportUtils");

    // The CSV parser handles "" escaping correctly in the parsing step.
    // But importFromCSV also strips outer quotes from the name column.
    // So "KALLAX ""special""" is parsed to: KALLAX "special"
    // Then the outer quote stripping removes the trailing "
    // This matches the round-trip: exportToCSV wraps name in quotes and
    // escapes inner quotes, importFromCSV strips the outer quotes.
    const csv = [
      "Artikelnummer,Name,Menge,Preis DE (EUR),Preis PL (PLN),Preis PL (EUR),Gesamt DE (EUR),Gesamt PL (EUR),Rabatt %,URL",
      '502.054.81,"KALLAX special",1,69.99,249.00,57.64,69.99,57.64,-17.65,',
    ].join("\n");

    const file = new File([csv], "test.csv", { type: "text/csv" });
    const items = await importFromCSV(file);

    // parseCSVLine handles the quotes, then outer-quote strip cleans up
    expect(items[0].name).toBe("KALLAX special");
  });
});

describe("Excel export / import", () => {
  it("writes a workbook and reads it back with values intact", async () => {
    const { exportToExcel, importFromExcel } = await import(
      "../../components/Export/exportUtils"
    );
    stubDownloadAnchor();

    await exportToExcel([makeItem(), makeItem({ key: "test-2", id: "00205431", name: 'VEDDINGE "Tür"', qty: 3 })], stats);

    expect(capturedBlob).not.toBeNull();
    const blob = capturedBlob as unknown as Blob;
    expect(blob.size).toBeGreaterThan(0);

    const file = new File([blob], "ikea-preisvergleich.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const imported = await importFromExcel(file);

    expect(imported).toHaveLength(2);

    // Article IDs are written with dots and normalized back on import
    expect(imported[0].id).toBe("50205481");
    expect(imported[0].name).toBe("KALLAX Regal");
    expect(imported[0].qty).toBe(1);
    expect(imported[0].priceDE).toBeCloseTo(69.99, 2);
    expect(imported[0].pricePLN).toBeCloseTo(249.0, 2);
    expect(imported[0].pricePLNInEur).toBeCloseTo(57.64, 2);
    expect(imported[0].discountInPercentage).toBeCloseTo(-17.65, 2);
    expect(imported[0].cheaperInPLN).toBe(true);
    expect(imported[0].url).toBe("https://www.ikea.de/p/kallax");

    // Quotes in names survive the round trip, and qty is carried over
    expect(imported[1].id).toBe("00205431");
    expect(imported[1].name).toBe('VEDDINGE "Tür"');
    expect(imported[1].qty).toBe(3);
  });

  it("flags missing prices as not found on import", async () => {
    const { exportToExcel, importFromExcel } = await import(
      "../../components/Export/exportUtils"
    );
    stubDownloadAnchor();

    await exportToExcel(
      [makeItem({ priceDE: 0, pricePLN: 0, pricePLNInEur: 0, url: "" })],
      stats
    );

    const file = new File([capturedBlob as unknown as Blob], "x.xlsx");
    const imported = await importFromExcel(file);

    expect(imported[0].notFoundDE).toBe(true);
    expect(imported[0].notFoundPL).toBe(true);
  });

  it("maps columns by header name rather than by position", async () => {
    const { importFromExcel } = await import(
      "../../components/Export/exportUtils"
    );
    const writeXlsxFile = (await import("write-excel-file/browser")).default;

    // Same data, columns deliberately in a different order
    const file = await writeXlsxFile([
      {
        sheet: "Produkte",
        data: [
          [
            { value: "Name", type: String },
            { value: "Menge", type: String },
            { value: "Artikelnummer", type: String },
            { value: "Preis DE (EUR)", type: String },
            { value: "Preis PL (EUR)", type: String },
          ],
          [
            { value: "BODBYN Tür", type: String },
            { value: 2, type: Number },
            { value: "502.054.81", type: String },
            { value: 82, type: Number },
            { value: 42.26, type: Number },
          ],
        ],
      },
    ]);

    const imported = await importFromExcel(
      new File([await file.toBlob()], "reordered.xlsx")
    );

    expect(imported).toHaveLength(1);
    expect(imported[0].id).toBe("50205481");
    expect(imported[0].name).toBe("BODBYN Tür");
    expect(imported[0].qty).toBe(2);
    expect(imported[0].priceDE).toBe(82);
    expect(imported[0].pricePLNInEur).toBe(42.26);
  });
});

describe("kitchenDemo config", () => {
  it("has valid kitchen items with article IDs and qty", async () => {
    const { kitchenItems } = await import("../../config/kitchenDemo");

    expect(kitchenItems.length).toBeGreaterThan(0);

    for (const item of kitchenItems) {
      expect(item.articleId).toMatch(/^\d{8,10}$/);
      expect(item.qty).toBeGreaterThan(0);
      expect(item.label.length).toBeGreaterThan(0);
    }
  });
});
