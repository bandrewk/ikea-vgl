import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";
import ThemeProvider from "../../components/Theme/ThemeProvider";
import { useTheme } from "../../hooks/useTheme";

function wrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("provides a theme value", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(["light", "dark"]).toContain(result.current.theme);
  });

  it("toggles theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    const initial = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).not.toBe(initial);
  });

  it("sets data-theme attribute on document", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe(
      result.current.theme
    );
  });
});
