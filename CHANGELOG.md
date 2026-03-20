# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
