import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import App from "../../App";
import ThemeProvider from "../../components/Theme/ThemeProvider";

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

describe("App integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the full app", () => {
    renderApp();
    expect(screen.getByText(/Preisvergleich/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("404.567.57")).toBeInTheDocument();
  });

  it("adds an item via article number input", async () => {
    renderApp();

    const input = screen.getByPlaceholderText("404.567.57");
    await userEvent.type(input, "50205481{enter}");

    await waitFor(
      () => {
        expect(screen.getByText(/KALLAX/)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("shows empty state initially", () => {
    renderApp();
    expect(screen.getByText(/Keine Einträge/)).toBeInTheDocument();
  });

  it("toggles dark mode", async () => {
    renderApp();

    const themeBtn = screen.getByRole("button", {
      name: /design aktivieren/i,
    });
    const initialTheme =
      document.documentElement.getAttribute("data-theme");

    await userEvent.click(themeBtn);

    expect(document.documentElement.getAttribute("data-theme")).not.toBe(
      initialTheme
    );
  });

  it("displays exchange rate in footer", async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/PLN/)).toBeInTheDocument();
    });
  });
});
