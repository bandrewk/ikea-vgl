import { useState, useEffect, useCallback, useRef, type SetStateAction } from "react";

// Only writes once the value has actually changed, so nothing is stored in the
// browser until the user does something.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const dirtyRef = useRef(false);

  const setStoredValue = useCallback((action: SetStateAction<T>) => {
    setValue((prev) => {
      const next =
        typeof action === "function" ? (action as (prev: T) => T)(prev) : action;
      if (!Object.is(next, prev)) dirtyRef.current = true;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!dirtyRef.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable
    }
  }, [key, value]);

  return [value, setStoredValue] as const;
}
