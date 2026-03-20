export const exchangeRateResponse = {
  amount: 1,
  base: "EUR",
  date: "2026-03-20",
  rates: { PLN: 4.32 },
};

export function ikeaProductResponse(
  name: string,
  typeName: string,
  price: number,
  pipUrl = ""
) {
  return {
    searchResultPage: {
      products: {
        main: {
          items: [
            {
              product: {
                name,
                typeName,
                salesPrice: { numeral: price },
                pipUrl,
              },
            },
          ],
        },
      },
      retiredProducts: [],
    },
  };
}

export function ikeaNotFoundResponse() {
  return {
    searchResultPage: {
      products: { main: { items: [] } },
      retiredProducts: [],
    },
  };
}

export function ikeaRetiredResponse(name: string) {
  return {
    searchResultPage: {
      products: { main: { items: [] } },
      retiredProducts: [{ name }],
    },
  };
}
