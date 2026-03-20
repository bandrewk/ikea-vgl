import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useLocalStorage } from "../../hooks/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial value when storage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "hello"));
    expect(result.current[0]).toBe("hello");
  });

  it("persists value to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "hello"));

    act(() => {
      result.current[1]("world");
    });

    expect(result.current[0]).toBe("world");
    expect(JSON.parse(localStorage.getItem("test-key")!)).toBe("world");
  });

  it("reads existing value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("existing"));

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default")
    );
    expect(result.current[0]).toBe("existing");
  });

  it("handles objects", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", { count: 0 })
    );

    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });
  });
});
