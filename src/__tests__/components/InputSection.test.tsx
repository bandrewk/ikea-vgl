import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import InputSection from "../../components/Input/InputSection";

describe("InputSection", () => {
  it("renders input and button", () => {
    render(<InputSection onAddItem={vi.fn()} />);
    expect(screen.getByPlaceholderText("404.567.57")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /hinzufügen/i })
    ).toBeInTheDocument();
  });

  it("shows error for letters", async () => {
    render(<InputSection onAddItem={vi.fn()} />);
    await userEvent.type(
      screen.getByPlaceholderText("404.567.57"),
      "abc"
    );
    expect(screen.getByText(/Fehlerhafte Eingabe/)).toBeInTheDocument();
  });

  it("calls onAddItem with cleaned article number", async () => {
    const onAddItem = vi.fn();
    render(<InputSection onAddItem={onAddItem} />);

    const input = screen.getByPlaceholderText("404.567.57");
    await userEvent.type(input, "404.567.57{enter}");

    expect(onAddItem).toHaveBeenCalledWith("40456757");
  });

  it("disables button when input has error", async () => {
    render(<InputSection onAddItem={vi.fn()} />);
    await userEvent.type(
      screen.getByPlaceholderText("404.567.57"),
      "abc"
    );
    expect(screen.getByRole("button", { name: /hinzufügen/i })).toBeDisabled();
  });
});
