import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExportPanel from "../../components/Export/ExportPanel";
import type { IkeaItem, Statistics } from "../../types/item";

const items: IkeaItem[] = [
  {
    key: "1",
    id: "50205481",
    name: "KALLAX",
    qty: 1,
    priceDE: 69.99,
    pricePLN: 249,
    pricePLNInEur: 57.64,
    discountInPercentage: -17.65,
    cheaperInPLN: true,
    url: "",
    notFoundDE: false,
    notFoundPL: false,
    retired: false,
  },
];

const stats: Statistics = {
  totalPriceDE: 69.99,
  totalPricePLEur: 57.64,
  totalDiscountInPercentage: 17.65,
  totalDiscount: 12.35,
  totalItems: 1,
  missingPLCount: 0,
  missingPLValueDE: 0,
};

describe("ExportPanel", () => {
  it("renders export and import buttons when items exist", () => {
    render(
      <ExportPanel items={items} stats={stats} onImport={vi.fn()} />
    );
    expect(screen.getByText("CSV")).toBeInTheDocument();
    expect(screen.getByText("Excel")).toBeInTheDocument();
    expect(screen.getByText(/Importieren/)).toBeInTheDocument();
    expect(screen.getByText(/Export \/ Import/)).toBeInTheDocument();
  });

  it("hides export buttons when no items, shows only import", () => {
    render(
      <ExportPanel items={[]} stats={{ ...stats, totalItems: 0 }} onImport={vi.fn()} />
    );
    expect(screen.queryByText("CSV")).not.toBeInTheDocument();
    expect(screen.queryByText("Excel")).not.toBeInTheDocument();
    expect(screen.getByText(/Importieren/)).toBeInTheDocument();
    expect(screen.getByText("Import")).toBeInTheDocument();
  });
});
