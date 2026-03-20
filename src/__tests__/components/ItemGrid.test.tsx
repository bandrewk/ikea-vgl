import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ItemGrid from "../../components/Items/ItemGrid";
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

const itemA = makeItem({
  key: "a",
  name: "AAA Produkt",
  priceDE: 10.0,
  pricePLNInEur: 8.0,
  discountInPercentage: -20.0,
});

const itemB = makeItem({
  key: "b",
  name: "BBB Produkt",
  priceDE: 50.0,
  pricePLNInEur: 55.0,
  discountInPercentage: 10.0,
});

const itemC = makeItem({
  key: "c",
  name: "CCC Produkt",
  priceDE: 30.0,
  pricePLNInEur: 25.0,
  discountInPercentage: -16.67,
});

const threeItems = [itemA, itemB, itemC];

describe("ItemGrid", () => {
  it("shows empty message when no items", () => {
    render(<ItemGrid items={[]} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />);
    expect(screen.getByText(/Keine Einträge/)).toBeInTheDocument();
  });

  it("renders items", () => {
    render(<ItemGrid items={[itemA]} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />);
    expect(screen.getByText("AAA Produkt")).toBeInTheDocument();
  });

  it("shows clear all button when items exist", () => {
    render(<ItemGrid items={[itemA]} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /alle.*entfernen/i })
    ).toBeInTheDocument();
  });

  it("calls onRemoveItem(null) when clear all is clicked", async () => {
    const onRemoveItem = vi.fn();
    render(<ItemGrid items={[itemA]} onRemoveItem={onRemoveItem} onUpdateQty={vi.fn()} />);

    await userEvent.click(
      screen.getByRole("button", { name: /alle.*entfernen/i })
    );
    expect(onRemoveItem).toHaveBeenCalledWith(null);
  });

  it("does not show sort dropdown with 0 or 1 items", () => {
    const { rerender } = render(
      <ItemGrid items={[]} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />
    );
    expect(screen.queryByLabelText("Sortierung")).not.toBeInTheDocument();

    rerender(
      <ItemGrid items={[itemA]} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />
    );
    expect(screen.queryByLabelText("Sortierung")).not.toBeInTheDocument();
  });

  it("shows sort dropdown with 2+ items", () => {
    render(
      <ItemGrid items={threeItems} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />
    );
    expect(screen.getByLabelText("Sortierung")).toBeInTheDocument();
  });

  it("sorts by discount descending (biggest savings first)", async () => {
    render(
      <ItemGrid items={threeItems} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />
    );

    await userEvent.selectOptions(screen.getByLabelText("Sortierung"), "discount-desc");

    const cards = screen.getAllByText(/Produkt/);
    // -20% (AAA) should be first, then -16.67% (CCC), then +10% (BBB)
    expect(cards[0].textContent).toContain("AAA");
    expect(cards[1].textContent).toContain("CCC");
    expect(cards[2].textContent).toContain("BBB");
  });

  it("sorts by discount ascending (least savings first)", async () => {
    render(
      <ItemGrid items={threeItems} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />
    );

    await userEvent.selectOptions(screen.getByLabelText("Sortierung"), "discount-asc");

    const cards = screen.getAllByText(/Produkt/);
    // +10% (BBB) first, then -16.67% (CCC), then -20% (AAA)
    expect(cards[0].textContent).toContain("BBB");
    expect(cards[1].textContent).toContain("CCC");
    expect(cards[2].textContent).toContain("AAA");
  });

  it("sorts by price descending", async () => {
    render(
      <ItemGrid items={threeItems} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />
    );

    await userEvent.selectOptions(screen.getByLabelText("Sortierung"), "price-desc");

    const cards = screen.getAllByText(/Produkt/);
    // 50 (BBB), 30 (CCC), 10 (AAA)
    expect(cards[0].textContent).toContain("BBB");
    expect(cards[1].textContent).toContain("CCC");
    expect(cards[2].textContent).toContain("AAA");
  });

  it("sorts by price ascending", async () => {
    render(
      <ItemGrid items={threeItems} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />
    );

    await userEvent.selectOptions(screen.getByLabelText("Sortierung"), "price-asc");

    const cards = screen.getAllByText(/Produkt/);
    // 10 (AAA), 30 (CCC), 50 (BBB)
    expect(cards[0].textContent).toContain("AAA");
    expect(cards[1].textContent).toContain("CCC");
    expect(cards[2].textContent).toContain("BBB");
  });

  it("sorts by name A–Z", async () => {
    render(
      <ItemGrid items={threeItems} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />
    );

    await userEvent.selectOptions(screen.getByLabelText("Sortierung"), "name");

    const cards = screen.getAllByText(/Produkt/);
    expect(cards[0].textContent).toContain("AAA");
    expect(cards[1].textContent).toContain("BBB");
    expect(cards[2].textContent).toContain("CCC");
  });

  it("returns to insertion order with 'added'", async () => {
    render(
      <ItemGrid items={threeItems} onRemoveItem={vi.fn()} onUpdateQty={vi.fn()} />
    );

    const select = screen.getByLabelText("Sortierung");

    // Sort by name first, then back to added
    await userEvent.selectOptions(select, "name");
    await userEvent.selectOptions(select, "added");

    const cards = screen.getAllByText(/Produkt/);
    // Original order: AAA, BBB, CCC
    expect(cards[0].textContent).toContain("AAA");
    expect(cards[1].textContent).toContain("BBB");
    expect(cards[2].textContent).toContain("CCC");
  });
});
