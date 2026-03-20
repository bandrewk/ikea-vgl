import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "../../components/Layout/Header";
import ThemeProvider from "../../components/Theme/ThemeProvider";

describe("Header", () => {
  it("renders the title", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    expect(screen.getByText(/Preisvergleich/)).toBeInTheDocument();
  });

  it("renders theme toggle button", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("button", { name: /design aktivieren/i })
    ).toBeInTheDocument();
  });
});
