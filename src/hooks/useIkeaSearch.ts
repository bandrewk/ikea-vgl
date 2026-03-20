import { useCallback, useEffect, useMemo, useRef } from "react";
import { API_URL_DE, API_URL_PLN } from "../config/api";
import { useLocalStorage } from "./useLocalStorage";
import { kitchenItems } from "../config/kitchenDemo";
import type { IkeaItem, Statistics } from "../types/item";

function createEmptyItem(id: string, overrides: Partial<IkeaItem> = {}): IkeaItem {
  return {
    key: Math.random().toString(),
    id,
    name: "",
    qty: 1,
    priceDE: 0,
    pricePLN: 0,
    pricePLNInEur: 0,
    discountInPercentage: 0,
    cheaperInPLN: false,
    url: "",
    notFoundDE: false,
    notFoundPL: false,
    retired: false,
    ...overrides,
  };
}

function isValidItem(item: unknown): item is IkeaItem {
  if (typeof item !== "object" || item === null) return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.key === "string" &&
    typeof i.id === "string" &&
    typeof i.priceDE === "number" &&
    typeof i.pricePLN === "number" &&
    typeof i.pricePLNInEur === "number" &&
    typeof i.discountInPercentage === "number" &&
    typeof i.qty === "number"
  );
}

export function useIkeaSearch(exchangeRate: number) {
  const [rawItems, setItems] = useLocalStorage<IkeaItem[]>("ikea-items", []);
  const items = rawItems.filter(isValidItem);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const demoLoadedRef = useRef(false);

  const stats: Statistics = useMemo(() => {
    let totalDEEur = 0;
    let totalPLEur = 0;
    let missingPLCount = 0;
    let missingPLValueDE = 0;

    for (const item of items) {
      if (item.priceDE > 0 && item.pricePLNInEur > 0) {
        totalDEEur += item.priceDE * item.qty;
        totalPLEur += item.pricePLNInEur * item.qty;
      }
      if (item.notFoundPL && item.priceDE > 0) {
        missingPLCount += item.qty;
        missingPLValueDE += item.priceDE * item.qty;
      }
    }

    const totalSaved = totalDEEur - totalPLEur;
    let totalDiscountInPercentage =
      ((100 / totalDEEur) * totalPLEur - 100) * -1;

    if (isNaN(totalDiscountInPercentage)) totalDiscountInPercentage = 0;

    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

    return {
      totalPriceDE: Math.round(totalDEEur * 100) / 100,
      totalPricePLEur: Math.round(totalPLEur * 100) / 100,
      totalDiscountInPercentage:
        items.length > 0
          ? Math.round(totalDiscountInPercentage * 100) / 100
          : 0,
      totalDiscount: Math.round(totalSaved * 100) / 100,
      totalItems: totalQty,
      missingPLCount,
      missingPLValueDE: Math.round(missingPLValueDE * 100) / 100,
    };
  }, [items]);

  // Recalculate existing items when exchange rate changes
  useEffect(() => {
    setItems((prev) => {
      const needsUpdate = prev.some(
        (item) => item.pricePLN > 0 && item.pricePLNInEur > 0
      );
      if (!needsUpdate) return prev;

      return prev.map((item) => {
        if (item.pricePLN > 0) {
          const pricePLNInEur =
            Math.round((item.pricePLN / exchangeRate) * 100) / 100;
          const discountInPercentage =
            Math.round(((100 / item.priceDE) * pricePLNInEur - 100) * 100) /
            100;
          return {
            ...item,
            pricePLNInEur,
            discountInPercentage,
            cheaperInPLN: discountInPercentage <= 0,
          };
        }
        return item;
      });
    });
  }, [exchangeRate, setItems]);

  const getPLNStorePrice = useCallback(
    (item: IkeaItem) => {
      fetch(`${API_URL_PLN}?${new URLSearchParams({ q: item.id })}`)
        .then((response) => {
          if (!response.ok) throw new Error("Response from IKEA PLN not ok");
          return response.json();
        })
        .then((data) => {
          const artikelArray = data.searchResultPage.products.main.items;
          const artikel = artikelArray[0].product;

          const foreignPrice =
            Math.round(artikel.salesPrice.numeral * 100) / 100;
          const priceInEUR = Math.round((foreignPrice / exchangeRate) * 100) / 100;
          const discountInPercentage =
            Math.round(((100 / item.priceDE) * priceInEUR - 100) * 100) / 100;

          setItems((prev) => [
            {
              ...item,
              pricePLN: foreignPrice,
              pricePLNInEur: priceInEUR,
              discountInPercentage,
              cheaperInPLN: discountInPercentage <= 0,
            },
            ...prev,
          ]);
        })
        .catch(() => {
          setItems((prev) => [
            { ...item, notFoundPL: true, cheaperInPLN: false },
            ...prev,
          ]);
        });
    },
    [exchangeRate, setItems]
  );

  const addItem = useCallback(
    (articleId: string, qty = 1) => {
      const normalizedId = articleId.replace(/\./g, "");
      const existing = itemsRef.current.find((item) => item.id === normalizedId);

      if (existing) {
        setItems((prev) =>
          prev.map((item) =>
            item.key === existing.key ? { ...item, qty: item.qty + qty } : item
          )
        );
        return;
      }

      fetch(`${API_URL_DE}?${new URLSearchParams({ q: articleId })}`)
        .then((response) => {
          if (!response.ok) throw new Error("Response from IKEA is not ok.");
          return response.json();
        })
        .then((data) => {
          const retired = data.searchResultPage.retiredProducts;
          if (
            retired &&
            retired.length > 0 &&
            data.searchResultPage.products.main.items.length === 0
          ) {
            setItems((prev) => [
              createEmptyItem(articleId, {
                name: retired[0].name,
                retired: true,
                qty,
              }),
              ...prev,
            ]);
            return;
          }

          const artikelArray = data.searchResultPage.products.main.items;
          const artikel = artikelArray[0].product;

          getPLNStorePrice(
            createEmptyItem(articleId, {
              name: `${artikel.name} ${artikel.typeName}`,
              priceDE: Math.round(artikel.salesPrice.numeral * 100) / 100,
              cheaperInPLN: true,
              url: artikel.pipUrl,
              qty,
            })
          );
        })
        .catch(() => {
          setItems((prev) => [
            createEmptyItem(articleId, {
              notFoundDE: true,
              notFoundPL: true,
              qty,
            }),
            ...prev,
          ]);
        });
    },
    [getPLNStorePrice, setItems]
  );

  const updateQty = useCallback(
    (itemKey: string, delta: number) => {
      setItems((prev) =>
        prev.reduce<IkeaItem[]>((acc, item) => {
          if (item.key === itemKey) {
            const newQty = item.qty + delta;
            if (newQty > 0) acc.push({ ...item, qty: newQty });
          } else {
            acc.push(item);
          }
          return acc;
        }, [])
      );
    },
    [setItems]
  );

  const removeItem = useCallback(
    (itemKey: string | null) => {
      if (itemKey === null) {
        setItems([]);
        demoLoadedRef.current = false;
        return;
      }
      setItems((prev) => prev.filter((item) => item.key !== itemKey));
    },
    [setItems]
  );

  const loadDemoData = useCallback((): boolean => {
    if (itemsRef.current.length > 0 || demoLoadedRef.current) return false;
    demoLoadedRef.current = true;
    const demoIds = [
      "50205481",
      "00205501",
      "80242745",
      "70401952",
      "50205495",
      "20475610",
      "80417759",
      "60205664",
      "09158190",
      "12312312",
      "60335199",
    ];
    demoIds.forEach((id) => addItem(id));
    return true;
  }, [addItem]);

  const loadKitchenDemo = useCallback((): boolean => {
    if (itemsRef.current.length > 0 || demoLoadedRef.current) return false;
    demoLoadedRef.current = true;
    kitchenItems.forEach((item, i) => {
      setTimeout(() => addItem(item.articleId, item.qty), i * 200);
    });
    return true;
  }, [addItem]);

  const importItems = useCallback(
    (imported: IkeaItem[]) => {
      setItems([]);
      demoLoadedRef.current = false;
      imported.forEach((item, i) => {
        setTimeout(() => addItem(item.id, item.qty), i * 200);
      });
    },
    [addItem, setItems]
  );

  return { items, stats, addItem, removeItem, updateQty, loadDemoData, loadKitchenDemo, importItems, setItems };
}
