import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Footer from "../../components/Layout/Footer";

const mockDemo = () => vi.fn(() => true);
const mockDemoBlocked = () => vi.fn(() => false);

describe("Footer", () => {
  it("displays version and exchange rate", () => {
    render(<Footer exchangeRate={4.32} onLoadDemo={mockDemo()} onLoadKitchen={mockDemo()} />);
    expect(screen.getByText("v2.0.0")).toBeInTheDocument();
    expect(screen.getByText(/4\.32 PLN/)).toBeInTheDocument();
  });

  it("calls onLoadDemo when demo button is clicked", async () => {
    const onLoadDemo = mockDemo();
    render(<Footer exchangeRate={4.32} onLoadDemo={onLoadDemo} onLoadKitchen={mockDemo()} />);

    await userEvent.click(screen.getByText(/Demo laden/));
    expect(onLoadDemo).toHaveBeenCalledOnce();
  });

  it("calls onLoadKitchen when kitchen button is clicked", async () => {
    const onLoadKitchen = mockDemo();
    render(<Footer exchangeRate={4.32} onLoadDemo={mockDemo()} onLoadKitchen={onLoadKitchen} />);

    await userEvent.click(screen.getByText(/Beispielküche/));
    expect(onLoadKitchen).toHaveBeenCalledOnce();
  });

  it("shows alert when demo is blocked by existing items", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const onLoadDemo = mockDemoBlocked();
    render(<Footer exchangeRate={4.32} onLoadDemo={onLoadDemo} onLoadKitchen={mockDemo()} />);

    await userEvent.click(screen.getByText(/Demo laden/));
    expect(alertSpy).toHaveBeenCalledWith(
      "Bitte zuerst alle Artikel löschen, um die Demo zu laden."
    );
    alertSpy.mockRestore();
  });

  it("shows alert when kitchen demo is blocked by existing items", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const onLoadKitchen = mockDemoBlocked();
    render(<Footer exchangeRate={4.32} onLoadDemo={mockDemo()} onLoadKitchen={onLoadKitchen} />);

    await userEvent.click(screen.getByText(/Beispielküche/));
    expect(alertSpy).toHaveBeenCalledWith(
      "Bitte zuerst alle Artikel löschen, um die Demo zu laden."
    );
    alertSpy.mockRestore();
  });

  it("renders GitHub link", () => {
    render(<Footer exchangeRate={4.32} onLoadDemo={mockDemo()} onLoadKitchen={mockDemo()} />);
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("displays copyright notice", () => {
    render(<Footer exchangeRate={4.32} onLoadDemo={mockDemo()} onLoadKitchen={mockDemo()} />);
    expect(screen.getByText(/© 2022–2026 bandrewk/)).toBeInTheDocument();
  });
});
