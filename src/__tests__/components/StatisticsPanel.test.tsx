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
});
