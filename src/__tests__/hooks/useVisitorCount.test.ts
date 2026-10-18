import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { useVisitorCount } from "../../hooks/useVisitorCount";

describe("useVisitorCount", () => {
  it("returns the count from the counter endpoint", async () => {
    const { result } = renderHook(() => useVisitorCount());

    expect(result.current).toBeNull();
    await waitFor(() => {
      expect(result.current).toBe(1234);
    });
  });

  it("stays null when the endpoint fails", async () => {
    server.use(
      http.get("*/counter.php", () => new HttpResponse(null, { status: 500 }))
    );
    const { result } = renderHook(() => useVisitorCount());

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(result.current).toBeNull();
  });

  it("stays null when the response is not JSON", async () => {
    server.use(
      http.get("*/counter.php", () => HttpResponse.text("<?php // raw source"))
    );
    const { result } = renderHook(() => useVisitorCount());

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(result.current).toBeNull();
  });
});
