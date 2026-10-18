import { useState, useEffect } from "react";
import { VISITOR_COUNTER_URL } from "../config/api";

// Self-hosted page-load counter: no cookies, no IPs, no third party.
// Stays null (hidden) if the endpoint is missing, e.g. in the dev server.
export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(VISITOR_COUNTER_URL, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Visitor counter not available");
        return res.json();
      })
      .then((data) => {
        if (typeof data.count === "number") setCount(data.count);
      })
      .catch(() => {
        // Counter is optional
      });
  }, []);

  return count;
}
