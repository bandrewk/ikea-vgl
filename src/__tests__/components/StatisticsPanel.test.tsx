import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatisticsPanel from "../../components/Statistics/StatisticsPanel";
import type { Statistics } from "../../types/item";

const stats: Statistics = {
  totalPriceDE: 139.98,
  totalPricePLEur: 115.28,
  totalDiscountInPercentage: 17.65,
  totalDiscount: 24.7,
  totalItems: 2,
  missingPLCount: 0,
  missingPLValueDE: 0,
};

describe("StatisticsPanel", () => {
  it("renders nothing when no items", () => {
    const { container } = render(
      <StatisticsPanel stats={{ ...stats, totalItems: 0 }} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("displays stats when items exist", () => {
    render(<StatisticsPanel stats={stats} />);
    expect(screen.getByText(/Ersparnis/)).toBeInTheDocument();
    expect(screen.getByText("€ 24.70")).toBeInTheDocument();
    expect(screen.getByText("€ 139.98")).toBeInTheDocument();
    expect(screen.getByText("€ 115.28")).toBeInTheDocument();
    expect(screen.getByText(/2.*Produkte/)).toBeInTheDocument();
  });

  it("does not show missing-PL warning when no items are missing", () => {
    render(<StatisticsPanel stats={stats} />);
    expect(screen.queryByText(/nicht in Polen/)).not.toBeInTheDocument();
  });

  it("shows missing-PL warning when items are missing from PL", () => {
    render(
      <StatisticsPanel
        stats={{ ...stats, missingPLCount: 4, missingPLValueDE: 500.0 }}
      />
    );
    expect(screen.getByText(/4 Produkte/)).toBeInTheDocument();
    expect(screen.getByText(/€ 500\.00/)).toBeInTheDocument();
    expect(screen.getByText(/nicht in Polen verfügbar/)).toBeInTheDocument();
    expect(screen.getByText(/nicht in Berechnung enthalten/)).toBeInTheDocument();
  });

  it("shows singular 'Produkt' when only 1 missing", () => {
    render(
      <StatisticsPanel
        stats={{ ...stats, missingPLCount: 1, missingPLValueDE: 32.0 }}
      />
    );
    expect(screen.getByText(/1 Produkt \(€ 32\.00\)/)).toBeInTheDocument();
  });
});
