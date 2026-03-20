[![CI](https://github.com/bandrewk/ikea-vgl/actions/workflows/ci.yml/badge.svg)](https://github.com/bandrewk/ikea-vgl/actions/workflows/ci.yml)
[![CD](https://github.com/bandrewk/ikea-vgl/actions/workflows/cd.yml/badge.svg)](https://github.com/bandrewk/ikea-vgl/actions/workflows/cd.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

# IKEA DE↔PL Price Comparison Tool

Source code of [www.ikea-vgl.de](https://www.ikea-vgl.de)

Compare IKEA product prices between Germany (DE) and Poland (PL) side by side. Many products are significantly cheaper in Poland — in some cases over 50%.

![Demo](docs/ikea-vgl.gif)

## Features

- Look up any IKEA product by article number
- Side-by-side price comparison between DE and PL stores
- Automatic PLN to EUR conversion with percentage discount
- Item quantity support (qty +/-)
- Sortable item grid (by discount, price, or name)
- CSV & Excel export/import with live price refresh on import
- Price comparison bar chart
- Dark/light theme toggle
- Example kitchen demo (49 real METOD/VEDDINGE articles)
- Missing-PL-item warning in stats
- Persistent product list (saved in browser)
- Detection of retired/discontinued products
- Content Security Policy

## Tech Stack

- React 18 + TypeScript
- Vite
- Recharts (charts)
- Lucide React (icons)
- CSS Modules with design tokens
- Vitest + Testing Library (105 tests)
- MSW (API mocking)

## Development

```bash
npm install      # install dependencies
npm run dev      # start dev server
npm test         # run tests
npm run build    # production build
```

## CI/CD

- **CI** — type check → tests → build (on push to `main`/`development`/`v2.0.0`, PRs to `main`)
- **CD** — type check → tests → build → FTP deploy (on push to `main`)

## Who is this for?

This tool is primarily useful for people living in Germany near the Polish border, or anyone planning a trip to Poland who wants to check whether buying IKEA products there would be cheaper.

## Notes

- Currency conversion uses live EUR/PLN exchange rates from the [European Central Bank](https://www.ecb.europa.eu/) via [frankfurter.app](https://www.frankfurter.app/). Falls back to a hardcoded rate if the API is unavailable.
- The interface is in German only.
- Product data is fetched directly from IKEA's public search API.

## Disclaimer

This project is not affiliated, associated, authorized, or endorsed by IKEA Deutschland GmbH & Co. KG or any of its subsidiaries. The official IKEA website can be found at [ikea.de](https://www.ikea.de). IKEA and related names, marks, and images are registered trademarks of their respective owners.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
