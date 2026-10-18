import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { server } from "../mocks/server";
import App from "../../App";
import ThemeProvider from "../../components/Theme/ThemeProvider";

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

describe("App integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the full app", () => {
    renderApp();
    expect(screen.getByText(/Preisvergleich/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("404.567.57")).toBeInTheDocument();
  });

  it("adds an item via article number input", async () => {
    renderApp();

    const input = screen.getByPlaceholderText("404.567.57");
    await userEvent.type(input, "50205481{enter}");

    await waitFor(
      () => {
        expect(screen.getByText(/KALLAX/)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("shows empty state initially", () => {
    renderApp();
    expect(screen.getByText(/Keine Einträge/)).toBeInTheDocument();
  });

  it("toggles dark mode", async () => {
    renderApp();

    const themeBtn = screen.getByRole("button", {
      name: /design aktivieren/i,
    });
    const initialTheme =
      document.documentElement.getAttribute("data-theme");

    await userEvent.click(themeBtn);

    expect(document.documentElement.getAttribute("data-theme")).not.toBe(
      initialTheme
    );
  });

  describe("on a plain page load", () => {
    const requested: string[] = [];
    const onRequest = ({ request }: { request: Request }) => {
      requested.push(new URL(request.url).host);
    };

    beforeEach(() => {
      requested.length = 0;
      server.events.on("request:start", onRequest);
    });

    afterEach(() => {
      server.events.removeListener("request:start", onRequest);
    });

    it("contacts no third party until an article is looked up", async () => {
      renderApp();
      await screen.findByText("Besucher: 1.234");

      expect(requested.every((host) => host === window.location.host)).toBe(true);

      const input = screen.getByPlaceholderText("404.567.57");
      await userEvent.type(input, "50205481{enter}");
      await screen.findByText(/KALLAX/, undefined, { timeout: 5000 });

      expect(requested.filter((host) => host === "api.frankfurter.dev")).toHaveLength(1);
    });

    it("stores nothing in the browser", async () => {
      renderApp();
      await screen.findByText("Besucher: 1.234");

      expect(localStorage.length).toBe(0);
    });
  });

  it("displays exchange rate in footer", async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/PLN/)).toBeInTheDocument();
    });
  });
});
