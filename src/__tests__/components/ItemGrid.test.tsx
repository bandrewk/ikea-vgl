import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ItemGrid from "../../components/Items/ItemGrid";
import type { IkeaItem } from "../../types/item";

const sampleItem: IkeaItem = {
  key: "test-1",
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
};

describe("ItemGrid", () => {
  it("shows empty message when no items", () => {
    render(<ItemGrid items={[]} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />);
    expect(screen.getByText(/Keine Einträge/)).toBeInTheDocument();
  });

  it("renders items", () => {
    render(<ItemGrid items={[sampleItem]} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />);
    expect(screen.getByText("KALLAX Regal")).toBeInTheDocument();
  });

  it("shows clear all button when items exist", () => {
    render(<ItemGrid items={[sampleItem]} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /alle.*entfernen/i })
    ).toBeInTheDocument();
  });

  it("calls onRemoveItem(null) when clear all is clicked", async () => {
    const onRemoveItem = vi.fn();
    render(<ItemGrid items={[sampleItem]} onRemoveItem={onRemoveItem} onUpdateQty={vi.fn()} />);

    await userEvent.click(
      screen.getByRole("button", { name: /alle.*entfernen/i })
    );
    expect(onRemoveItem).toHaveBeenCalledWith(null);
  });
});
