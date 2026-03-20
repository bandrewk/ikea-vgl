import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { ikeaRetiredResponse } from "../mocks/fixtures";
import { useIkeaSearch } from "../../hooks/useIkeaSearch";

beforeEach(() => {
  localStorage.clear();
});

describe("useIkeaSearch", () => {
  describe("initial state", () => {
    it("starts with empty items and zero stats", () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));
      expect(result.current.items).toEqual([]);
      expect(result.current.stats.totalItems).toBe(0);
      expect(result.current.stats.totalPriceDE).toBe(0);
      expect(result.current.stats.totalDiscountInPercentage).toBe(0);
    });
  });

  describe("addItem", () => {
    it("fetches and adds an item from DE and PL APIs", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      const item = result.current.items[0];
      expect(item.id).toBe("50205481");
      expect(item.name).toBe("KALLAX Regal");
      expect(item.priceDE).toBe(69.99);
      expect(item.qty).toBe(1);
    });

    it("strips dots from articleId for duplicate lookup", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      // Add without dots first
      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      // Adding with dots should match the existing item (normalizes to same ID)
      act(() => {
        result.current.addItem("502.054.81");
      });

      // Should bump qty, not add a new item
      await waitFor(() => {
        expect(result.current.items[0].qty).toBe(2);
      });

      expect(result.current.items.length).toBe(1);
    });

    it("accepts a qty parameter", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481", 5);
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      expect(result.current.items[0].qty).toBe(5);
    });

    it("increments qty when adding a duplicate article", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items[0].qty).toBe(2);
      });

      // Still only one item in the list
      expect(result.current.items.length).toBe(1);
    });

    it("increments by qty parameter for duplicates", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      act(() => {
        result.current.addItem("50205481", 3);
      });

      await waitFor(() => {
        expect(result.current.items[0].qty).toBe(4);
      });
    });

    it("handles retired products", async () => {
      server.use(
        http.get(
          "https://sik.search.blue.cdtapps.com/de/de/search-result-page",
          () => HttpResponse.json(ikeaRetiredResponse("ALTES PRODUKT"))
        )
      );

      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("99999999");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      expect(result.current.items[0].retired).toBe(true);
      expect(result.current.items[0].name).toBe("ALTES PRODUKT");
    });

    it("handles retired products with qty", async () => {
      server.use(
        http.get(
          "https://sik.search.blue.cdtapps.com/de/de/search-result-page",
          () => HttpResponse.json(ikeaRetiredResponse("ALTES PRODUKT"))
        )
      );

      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("99999999", 3);
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      expect(result.current.items[0].qty).toBe(3);
    });

    it("handles DE API failure gracefully", async () => {
      server.use(
        http.get(
          "https://sik.search.blue.cdtapps.com/de/de/search-result-page",
          () => new HttpResponse(null, { status: 500 })
        )
      );

      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("99999999");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      expect(result.current.items[0].notFoundDE).toBe(true);
      expect(result.current.items[0].notFoundPL).toBe(true);
    });

    it("handles PL API failure — sets notFoundPL", async () => {
      server.use(
        http.get(
          "https://sik.search.blue.cdtapps.com/pl/pl/search-result-page",
          () => new HttpResponse(null, { status: 404 })
        )
      );

      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
        expect(result.current.items[0].notFoundPL).toBe(true);
      });
    });
  });

  describe("removeItem", () => {
    it("removes a single item by key", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      const key = result.current.items[0].key;

      act(() => {
        result.current.removeItem(key);
      });

      expect(result.current.items.length).toBe(0);
    });

    it("clears all items when key is null", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      act(() => {
        result.current.removeItem(null);
      });

      expect(result.current.items.length).toBe(0);
    });
  });

  describe("updateQty", () => {
    it("increments item quantity", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      const key = result.current.items[0].key;

      act(() => {
        result.current.updateQty(key, 1);
      });

      expect(result.current.items[0].qty).toBe(2);
    });

    it("decrements item quantity", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481", 3);
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      const key = result.current.items[0].key;

      act(() => {
        result.current.updateQty(key, -1);
      });

      expect(result.current.items[0].qty).toBe(2);
    });

    it("removes item when qty reaches zero", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      const key = result.current.items[0].key;

      act(() => {
        result.current.updateQty(key, -1);
      });

      expect(result.current.items.length).toBe(0);
    });
  });

  describe("stats", () => {
    it("calculates totals with qty", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481", 2);
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
        expect(result.current.items[0].pricePLNInEur).toBeGreaterThan(0);
      });

      const stats = result.current.stats;
      expect(stats.totalItems).toBe(2);
      expect(stats.totalPriceDE).toBe(
        Math.round(result.current.items[0].priceDE * 2 * 100) / 100
      );
    });

    it("tracks missing PL items", async () => {
      server.use(
        http.get(
          "https://sik.search.blue.cdtapps.com/pl/pl/search-result-page",
          () => new HttpResponse(null, { status: 404 })
        )
      );

      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481", 3);
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
        expect(result.current.items[0].notFoundPL).toBe(true);
      });

      expect(result.current.stats.missingPLCount).toBe(3);
      expect(result.current.stats.missingPLValueDE).toBeGreaterThan(0);
    });

    it("returns zero discount percentage when no items", () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));
      expect(result.current.stats.totalDiscountInPercentage).toBe(0);
    });
  });

  describe("loadDemoData", () => {
    it("returns false and does not load if items already present", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      let returned: boolean | undefined;
      act(() => {
        returned = result.current.loadDemoData();
      });

      expect(returned).toBe(false);
      expect(result.current.items.length).toBe(1);
    });

    it("returns true and loads all demo items with qty=1", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      let returned: boolean | undefined;
      act(() => {
        returned = result.current.loadDemoData();
      });

      expect(returned).toBe(true);

      await waitFor(() => {
        expect(result.current.items.length).toBeGreaterThan(0);
      });

      for (const item of result.current.items) {
        expect(item.qty).toBe(1);
      }
    });

    it("returns false on second call (already loading)", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.loadDemoData();
      });

      let returned: boolean | undefined;
      act(() => {
        returned = result.current.loadDemoData();
      });

      expect(returned).toBe(false);
    });
  });

  describe("loadKitchenDemo", () => {
    it("returns false and does not load if items already present", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      let returned: boolean | undefined;
      act(() => {
        returned = result.current.loadKitchenDemo();
      });

      expect(returned).toBe(false);
      expect(result.current.items.length).toBe(1);
    });

    it("returns true on successful load", () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useIkeaSearch(4.32));

      let returned: boolean | undefined;
      act(() => {
        returned = result.current.loadKitchenDemo();
      });

      expect(returned).toBe(true);

      act(() => {
        vi.advanceTimersByTime(0);
      });

      vi.useRealTimers();
    });

    it("returns false on second call (already loading)", () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.loadKitchenDemo();
      });

      let returned: boolean | undefined;
      act(() => {
        returned = result.current.loadKitchenDemo();
      });

      expect(returned).toBe(false);
      vi.useRealTimers();
    });
  });

  describe("importItems", () => {
    const fakeImported: import("../../types/item").IkeaItem[] = [
      {
        key: "old-1",
        id: "50205481",
        name: "KALLAX Regal",
        qty: 3,
        priceDE: 60.0,
        pricePLN: 200.0,
        pricePLNInEur: 50.0,
        discountInPercentage: -16.67,
        cheaperInPLN: true,
        url: "",
        notFoundDE: false,
        notFoundPL: false,
        retired: false,
      },
      {
        key: "old-2",
        id: "00205501",
        name: "OLD ITEM",
        qty: 2,
        priceDE: 30.0,
        pricePLN: 100.0,
        pricePLNInEur: 25.0,
        discountInPercentage: -16.67,
        cheaperInPLN: true,
        url: "",
        notFoundDE: false,
        notFoundPL: false,
        retired: false,
      },
    ];

    it("clears existing items and re-fetches imported ones with fresh prices", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      // Add an item first
      act(() => {
        result.current.addItem("50205481");
      });

      await waitFor(() => {
        expect(result.current.items.length).toBe(1);
      });

      // Now import — should clear and re-fetch
      vi.useFakeTimers();
      act(() => {
        result.current.importItems(fakeImported);
      });

      // Items should be cleared immediately
      expect(result.current.items.length).toBe(0);

      // Advance timers to trigger the staggered addItem calls
      await act(async () => {
        vi.advanceTimersByTime(0); // first item (0 * 200)
      });
      await act(async () => {
        vi.advanceTimersByTime(200); // second item (1 * 200)
      });
      vi.useRealTimers();

      // Items should be re-fetching with fresh prices
      await waitFor(() => {
        expect(result.current.items.length).toBe(2);
      });

      // Prices should come from the mock API, not the old imported values
      const kallax = result.current.items.find((i) => i.id === "50205481");
      expect(kallax).toBeDefined();
      expect(kallax!.priceDE).toBe(69.99); // fresh from mock, not 60.0
      expect(kallax!.qty).toBe(3); // qty preserved from import
    });

    it("preserves qty from imported items", async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.importItems(fakeImported);
      });

      // Advance all timers
      await act(async () => {
        vi.advanceTimersByTime(400);
      });
      vi.useRealTimers();

      await waitFor(() => {
        expect(result.current.items.length).toBe(2);
      });

      const item1 = result.current.items.find((i) => i.id === "50205481");
      const item2 = result.current.items.find((i) => i.id === "00205501");
      expect(item1!.qty).toBe(3);
      expect(item2!.qty).toBe(2);
    });

    it("allows loading demo again after import (resets demoLoadedRef)", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      // Load demo first
      act(() => {
        result.current.loadDemoData();
      });

      await waitFor(() => {
        expect(result.current.items.length).toBeGreaterThan(0);
      });

      // Import clears and resets
      vi.useFakeTimers();
      act(() => {
        result.current.importItems(fakeImported);
      });

      await act(async () => {
        vi.advanceTimersByTime(400);
      });
      vi.useRealTimers();

      await waitFor(() => {
        expect(result.current.items.length).toBe(2);
      });

      // Clear all
      act(() => {
        result.current.removeItem(null);
      });

      expect(result.current.items.length).toBe(0);

      // Demo should work again since import reset the guard
      act(() => {
        result.current.loadDemoData();
      });

      await waitFor(() => {
        expect(result.current.items.length).toBeGreaterThan(0);
      });
    });

    it("does not leak forEach index as qty", async () => {
      // Regression: ensure forEach((item, i) => ...) doesn't pass index as qty
      const threeItems = [
        { ...fakeImported[0], id: "50205481", qty: 1 },
        { ...fakeImported[0], id: "00205501", qty: 1 },
        { ...fakeImported[0], id: "80242745", qty: 1 },
      ];

      vi.useFakeTimers();
      const { result } = renderHook(() => useIkeaSearch(4.32));

      act(() => {
        result.current.importItems(threeItems);
      });

      await act(async () => {
        vi.advanceTimersByTime(600);
      });
      vi.useRealTimers();

      await waitFor(() => {
        expect(result.current.items.length).toBe(3);
      });

      // Every item must have qty=1, not 0, 1, 2 (forEach indices)
      for (const item of result.current.items) {
        expect(item.qty).toBe(1);
      }
    });
  });

  describe("demo reload after clear", () => {
    it("allows reloading demo after clearing all items", async () => {
      const { result } = renderHook(() => useIkeaSearch(4.32));

      // Load demo
      act(() => {
        result.current.loadDemoData();
      });

      await waitFor(() => {
        expect(result.current.items.length).toBeGreaterThan(0);
      });

      // Clear all
      act(() => {
        result.current.removeItem(null);
      });

      expect(result.current.items.length).toBe(0);

      // Should be able to load demo again
      act(() => {
        result.current.loadDemoData();
      });

      await waitFor(() => {
        expect(result.current.items.length).toBeGreaterThan(0);
      });

      // All items must still have qty=1
      for (const item of result.current.items) {
        expect(item.qty).toBe(1);
      }
    });
  });
});
