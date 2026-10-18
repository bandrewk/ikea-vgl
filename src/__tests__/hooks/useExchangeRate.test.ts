import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useExchangeRate } from "../../hooks/useExchangeRate";
import { EUR_TO_PLN_RATE_AVG } from "../../config/api";

describe("useExchangeRate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with fallback rate and does not fetch on mount", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useExchangeRate());

    expect(result.current.exchangeRate).toBe(EUR_TO_PLN_RATE_AVG);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("fetches exchange rate from API when requested", async () => {
    const { result } = renderHook(() => useExchangeRate());

    act(() => result.current.requestRate());

    await waitFor(() => {
      expect(result.current.exchangeRate).toBe(4.32);
    });
    expect(result.current.loading).toBe(false);
  });

  it("fetches only once across multiple requests", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useExchangeRate());

    act(() => {
      result.current.requestRate();
      result.current.requestRate();
    });

    await waitFor(() => {
      expect(result.current.exchangeRate).toBe(4.32);
    });
    act(() => result.current.requestRate());

    expect(fetchSpy).toHaveBeenCalledOnce();
  });
});
