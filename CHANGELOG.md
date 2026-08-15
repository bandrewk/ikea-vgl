# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.1] - 2026-08-15

### Fixed

- Live exchange rate was silently broken: `api.frankfurter.app` now redirects to
  `api.frankfurter.dev` and the redirect carries no CORS headers, so every rate
  lookup failed and the app fell back to the hardcoded average (4.2593 instead
  of the actual 4.3068 — every PL price and discount off by roughly 1 %).
  Switched to the new endpoint and updated the CSP.
- Test suite failed on Node 22 and newer: Node's experimental global
  `localStorage` stays undefined without `--localstorage-file` and shadows the
  jsdom implementation, breaking 41 of 105 tests. The test setup now restores a
  Storage-compatible implementation when that happens.
- Excel export tests replaced the global `URL` with a plain object, which
  dropped its constructor and broke unrelated code calling `new URL(...)`.

### Changed

- Replaced SheetJS (`xlsx`) with `write-excel-file` and `read-excel-file`. The
  two high-severity advisories against `xlsx` have no fix on the npm registry,
  since the patched releases were never published there. Excel files keep the
  same two sheets and column headers, and files written by earlier versions
  still import. The Excel chunk drops from 424 kB to 134 kB (141 kB → 37 kB
  gzipped) and splits so export and import load separately.
- Upgraded the test and build toolchain: Vitest 2 → 4, Vite 6 → 8, jsdom 25 → 30,
  plus minor bumps for MSW, user-event and Fontsource. Together with the SheetJS
  replacement this clears every advisory reported by `npm audit`.
- CI and CD now run on Node 24, and CI also runs for pull requests against
  `development`.

### Added

- Dependabot configuration for npm and GitHub Actions, targeting `development`.
- Tests for the Excel export and import, which previously had none: a full
  round trip and a check that columns are matched by header name.
- `engines` field pinning the Node floor the toolchain actually requires
  (^20.19.0 || >=22.12.0).

## [2.0.0] - 2026-03-20

### Added

- Complete rewrite in React 18 + TypeScript with Vite
- Bento-grid UI layout with CSS Modules and design tokens
- Dark/light theme toggle
- Item quantity support (qty +/-)
- Sortable item grid (by discount, price, or name)
- CSV & Excel export/import with live price refresh on import
- Price comparison bar chart (Recharts)
- Example kitchen demo with 49 real METOD/VEDDINGE articles
- Missing-PL-item warning in stats
- Content Security Policy
- CI workflow (type check, tests, build)
- CD workflow (type check, tests, build, FTP deploy)
- 105 tests with Vitest, Testing Library, and MSW

### Changed

- Migrated from vanilla JavaScript to React + TypeScript
- Replaced manual DOM manipulation with component architecture
- Switched build tooling to Vite

### Removed

- Legacy vanilla JS source files

## [1.0.3] - 2026-03-17

### Fixed

- IKEA API integration: updated product price field path to match current API response structure

### Added

- Live EUR/PLN exchange rates from ECB via frankfurter.app (with hardcoded fallback)
- Exchange rate display in footer with ECB attribution
- Retired/discontinued product handling ("Nicht mehr verfügbar")
- GitHub link in footer

### Changed

- License changed from GPL-3.0 to AGPL-3.0
- README rewritten with features, usage notes, and IKEA trademark disclaimer
- Updated copyright to 2022-2026
- Updated favicon and logos

## [1.0.2] - 2022-06-20

### Added

- New responsive layout
- Persistent storage of items

### Changed

- Updated EUR/PLN exchange rate to the average of 2022

### Fixed

- Minor fixes

## [1.0.1-beta] - 2022-05-14

### Added

- Initial release
- IKEA product lookup by article number
- Side-by-side DE/PL price comparison
- Automatic PLN to EUR conversion
- Demo mode with pre-loaded example products
