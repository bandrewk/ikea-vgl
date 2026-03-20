import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Footer from "../../components/Layout/Footer";

describe("Footer", () => {
  it("displays version and exchange rate", () => {
    render(<Footer exchangeRate={4.32} onLoadDemo={vi.fn()} />);
    expect(screen.getByText("v2.0.0")).toBeInTheDocument();
    expect(screen.getByText(/4\.32 PLN/)).toBeInTheDocument();
  });

  it("calls onLoadDemo when demo button is clicked", async () => {
    const onLoadDemo = vi.fn();
    render(<Footer exchangeRate={4.32} onLoadDemo={onLoadDemo} />);

    await userEvent.click(screen.getByText(/Demo laden/));
    expect(onLoadDemo).toHaveBeenCalledOnce();
  });

  it("renders GitHub link", () => {
    render(<Footer exchangeRate={4.32} onLoadDemo={vi.fn()} />);
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });
});
