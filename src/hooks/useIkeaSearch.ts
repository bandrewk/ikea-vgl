import { useCallback, useEffect, useMemo } from "react";
import { API_URL_DE, API_URL_PLN } from "../config/api";
import { useLocalStorage } from "./useLocalStorage";
import type { IkeaItem, Statistics } from "../types/item";

function createEmptyItem(id: string, overrides: Partial<IkeaItem> = {}): IkeaItem {
  return {
    key: Math.random().toString(),
    id,
    name: "",
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

export function useIkeaSearch(exchangeRate: number) {
  const [items, setItems] = useLocalStorage<IkeaItem[]>("ikea-items", []);

  const stats: Statistics = useMemo(() => {
    let totalDEEur = 0;
    let totalPLEur = 0;

    for (const item of items) {
      if (item.priceDE > 0 && item.pricePLNInEur > 0) {
        totalDEEur += item.priceDE;
        totalPLEur += item.pricePLNInEur;
      }
    }

    const totalSaved = totalDEEur - totalPLEur;
    let totalDiscountInPercentage =
      ((100 / totalDEEur) * totalPLEur - 100) * -1;

    if (isNaN(totalDiscountInPercentage)) totalDiscountInPercentage = 0;

    return {
      totalPriceDE: Math.round(totalDEEur * 100) / 100,
      totalPricePLEur: Math.round(totalPLEur * 100) / 100,
      totalDiscountInPercentage:
        items.length > 0
          ? Math.round(totalDiscountInPercentage * 100) / 100
          : 0,
      totalDiscount: Math.round(totalSaved * 100) / 100,
      totalItems: items.length,
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
      fetch(`${API_URL_PLN}?q=${item.id}`)
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
    (articleId: string) => {
      fetch(`${API_URL_DE}?q=${articleId}`)
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
            })
          );
        })
        .catch(() => {
          setItems((prev) => [
            createEmptyItem(articleId, {
              notFoundDE: true,
              notFoundPL: true,
            }),
            ...prev,
          ]);
        });
    },
    [getPLNStorePrice, setItems]
  );

  const removeItem = useCallback(
    (itemKey: string | null) => {
      if (itemKey === null) {
        setItems([]);
        return;
      }
      setItems((prev) => prev.filter((item) => item.key !== itemKey));
    },
    [setItems]
  );

  const loadDemoData = useCallback(() => {
    if (items.length > 0) return;
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
    demoIds.forEach(addItem);
  }, [items.length, addItem]);

  return { items, stats, addItem, removeItem, loadDemoData, setItems };
}
