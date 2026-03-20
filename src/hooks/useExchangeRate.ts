import { useState, useEffect } from "react";
import { EUR_TO_PLN_RATE_AVG, EXCHANGE_RATE_API } from "../config/api";

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState(EUR_TO_PLN_RATE_AVG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return { exchangeRate, loading };
}
