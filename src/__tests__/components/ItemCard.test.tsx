import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ItemCard from "../../components/Items/ItemCard";
import type { IkeaItem } from "../../types/item";

const baseItem: IkeaItem = {
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
};

describe("ItemCard", () => {
  it("renders item with prices", () => {
    render(<ItemCard item={baseItem} onRemove={vi.fn()} onUpdateQty={vi.fn()} />);
    expect(screen.getByText("KALLAX Regal")).toBeInTheDocument();
    expect(screen.getByText("€ 69.99")).toBeInTheDocument();
    expect(screen.getByText("€ 57.64")).toBeInTheDocument();
    expect(screen.getByText("502.054.81")).toBeInTheDocument();
  });

  it("shows saving badge for cheaper PL items", () => {
    render(<ItemCard item={baseItem} onRemove={vi.fn()} onUpdateQty={vi.fn()} />);
    expect(screen.getByText(/17\.6%/)).toBeInTheDocument();
  });

  it("shows retired state", () => {
    render(
      <ItemCard
        item={{ ...baseItem, retired: true }}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    );
    expect(screen.getByText("Nicht mehr verfügbar")).toBeInTheDocument();
  });

  it("shows not found DE state", () => {
    render(
      <ItemCard
        item={{ ...baseItem, notFoundDE: true }}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    );
    expect(screen.getByText("Artikel nicht gefunden!")).toBeInTheDocument();
  });

  it("shows not found PL state", () => {
    render(
      <ItemCard
        item={{ ...baseItem, notFoundPL: true }}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    );
    expect(screen.getByText("Nicht gefunden")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const onRemove = vi.fn();
    render(<ItemCard item={baseItem} onRemove={onRemove} onUpdateQty={vi.fn()} />);

    await userEvent.click(
      screen.getByRole("button", { name: /entfernen/i })
    );
    expect(onRemove).toHaveBeenCalledWith("test-1");
  });

  it("displays qty badge when qty > 1", () => {
    render(
      <ItemCard
        item={{ ...baseItem, qty: 3 }}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    );
    expect(screen.getByText("×3")).toBeInTheDocument();
  });

  it("does not display qty badge when qty is 1", () => {
    render(<ItemCard item={baseItem} onRemove={vi.fn()} onUpdateQty={vi.fn()} />);
    expect(screen.queryByText(/×1/)).not.toBeInTheDocument();
  });

  it("shows total price when qty > 1", () => {
    render(
      <ItemCard
        item={{ ...baseItem, qty: 3 }}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    );
    // DE: € 69.99 × 3 = € 209.97
    expect(screen.getByText(/69\.99 × 3 = € 209\.97/)).toBeInTheDocument();
    // PL: € 57.64 × 3 = € 172.92
    expect(screen.getByText(/57\.64 × 3 = € 172\.92/)).toBeInTheDocument();
  });

  it("calls onUpdateQty with +1 when plus button is clicked", async () => {
    const onUpdateQty = vi.fn();
    render(<ItemCard item={baseItem} onRemove={vi.fn()} onUpdateQty={onUpdateQty} />);

    await userEvent.click(
      screen.getByRole("button", { name: /erhöhen/i })
    );
    expect(onUpdateQty).toHaveBeenCalledWith("test-1", 1);
  });

  it("calls onUpdateQty with -1 when minus button is clicked", async () => {
    const onUpdateQty = vi.fn();
    render(<ItemCard item={baseItem} onRemove={vi.fn()} onUpdateQty={onUpdateQty} />);

    await userEvent.click(
      screen.getByRole("button", { name: /verringern/i })
    );
    expect(onUpdateQty).toHaveBeenCalledWith("test-1", -1);
  });

  it("shows qty value in controls", () => {
    render(
      <ItemCard
        item={{ ...baseItem, qty: 5 }}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
