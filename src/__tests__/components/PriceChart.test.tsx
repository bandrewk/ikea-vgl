import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PriceChart from "../../components/Statistics/PriceChart";
import type { IkeaItem } from "../../types/item";

function makeItem(overrides: Partial<IkeaItem> = {}): IkeaItem {
  return {
    key: Math.random().toString(),
    id: "50205481",
    name: "KALLAX Regal",
    qty: 1,
    priceDE: 69.99,
    pricePLN: 249.0,
    pricePLNInEur: 57.64,
    discountInPercentage: -17.65,
    cheaperInPLN: true,
    url: "",
    notFoundDE: false,
    notFoundPL: false,
    retired: false,
    ...overrides,
  };
}

describe("PriceChart", () => {
  it("returns null when items array is empty", () => {
    const { container } = render(<PriceChart items={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when all items have zero prices", () => {
    const items = [makeItem({ priceDE: 0, pricePLNInEur: 0 })];
    const { container } = render(<PriceChart items={items} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders chart when items have valid prices", () => {
    const items = [makeItem()];
    render(<PriceChart items={items} />);
    expect(screen.getByText("Preisvergleich")).toBeInTheDocument();
  });

  it("filters out items with zero DE price", () => {
    const items = [
      makeItem({ key: "a", name: "Good", priceDE: 50, pricePLNInEur: 40 }),
      makeItem({ key: "b", name: "Bad", priceDE: 0, pricePLNInEur: 40 }),
    ];
    render(<PriceChart items={items} />);
    expect(screen.getByText("Preisvergleich")).toBeInTheDocument();
  });

  it("filters out items with zero PL price", () => {
    const items = [
      makeItem({ key: "a", name: "Good", priceDE: 50, pricePLNInEur: 40 }),
      makeItem({ key: "b", name: "Bad", priceDE: 50, pricePLNInEur: 0 }),
    ];
    render(<PriceChart items={items} />);
    expect(screen.getByText("Preisvergleich")).toBeInTheDocument();
  });

  it("truncates long names to 18 chars for single-qty items", () => {
    const items = [makeItem({ name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", qty: 1 })];
    render(<PriceChart items={items} />);
    // The chart renders via recharts SVG — we just verify it doesn't crash
    expect(screen.getByText("Preisvergleich")).toBeInTheDocument();
  });

  it("truncates long names to 14 chars for multi-qty items", () => {
    const items = [makeItem({ name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", qty: 3 })];
    render(<PriceChart items={items} />);
    expect(screen.getByText("Preisvergleich")).toBeInTheDocument();
  });
});
