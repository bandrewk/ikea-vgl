import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useExchangeRate } from "../../hooks/useExchangeRate";

describe("useExchangeRate", () => {
  it("fetches exchange rate from API", async () => {
    const { result } = renderHook(() => useExchangeRate());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.exchangeRate).toBe(4.32);
  });

  it("starts with fallback rate", () => {
    const { result } = renderHook(() => useExchangeRate());
    // Initial value is the hardcoded fallback
    expect(result.current.exchangeRate).toBe(4.2593);
  });
});
