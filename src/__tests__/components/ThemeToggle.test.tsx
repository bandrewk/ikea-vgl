import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import ThemeProvider from "../../components/Theme/ThemeProvider";
import ThemeToggle from "../../components/Theme/ThemeToggle";

describe("ThemeToggle", () => {
  it("toggles theme on click", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const btn = screen.getByRole("button");
    const initialLabel = btn.getAttribute("aria-label");

    await userEvent.click(btn);

    const newLabel = btn.getAttribute("aria-label");
    expect(newLabel).not.toBe(initialLabel);
  });
});
