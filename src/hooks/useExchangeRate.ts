import { useState, useCallback, useRef } from "react";
import { EUR_TO_PLN_RATE_AVG, EXCHANGE_RATE_API } from "../config/api";

// The live rate is only fetched once the user looks up an article, so a plain
// page view never contacts the exchange rate API.
export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState(EUR_TO_PLN_RATE_AVG);
  const [loading, setLoading] = useState(false);
  const requestedRef = useRef(false);

  const requestRate = useCallback(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    setLoading(true);

    fetch(EXCHANGE_RATE_API)
      .then((res) => res.json())
      .then((data) => {
        if (data.rates?.PLN) {
          setExchangeRate(data.rates.PLN);
        }
      })
      .catch(() => {
        // Fallback to hardcoded rate
      })
      .finally(() => setLoading(false));
  }, []);

  return { exchangeRate, loading, requestRate };
}
