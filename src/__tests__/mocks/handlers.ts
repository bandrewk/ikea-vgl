import { http, HttpResponse } from "msw";
import {
  exchangeRateResponse,
  ikeaProductResponse,
  ikeaNotFoundResponse,
} from "./fixtures";

export const handlers = [
  // Exchange rate
  http.get("https://api.frankfurter.app/latest", () => {
    return HttpResponse.json(exchangeRateResponse);
  }),

  // IKEA DE
  http.get(
    "https://sik.search.blue.cdtapps.com/de/de/search-result-page",
    ({ request }) => {
      const url = new URL(request.url);
      const q = url.searchParams.get("q");

      if (q === "50205481") {
        return HttpResponse.json(
          ikeaProductResponse("KALLAX", "Regal", 69.99, "https://www.ikea.de/p/kallax")
        );
      }
      if (q === "12312312") {
        return HttpResponse.json(ikeaNotFoundResponse());
      }

      return HttpResponse.json(
        ikeaProductResponse("TESTPRODUKT", "Typ", 49.99, "https://www.ikea.de/p/test")
      );
    }
  ),

  // IKEA PL
  http.get(
    "https://sik.search.blue.cdtapps.com/pl/pl/search-result-page",
    ({ request }) => {
      const url = new URL(request.url);
      const q = url.searchParams.get("q");

      if (q === "80242745" || q === "09158190") {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(
        ikeaProductResponse("TESTPRODUKT", "Typ", 199.0)
      );
    }
  ),
];
