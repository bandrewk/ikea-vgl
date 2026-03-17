[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

# IKEA DE↔PL Price Comparison Tool

Source code of [www.ikea-vgl.de](https://www.ikea-vgl.de)

Compare IKEA product prices between Germany (DE) and Poland (PL) side by side. Many products are significantly cheaper in Poland — in some cases over 50%.

## Features

- Look up any IKEA product by article number
- Side-by-side price comparison between DE and PL stores
- Automatic PLN to EUR conversion
- Percentage discount calculation
- Persistent product list (saved in browser)
- Detection of retired/discontinued products
- Demo mode with pre-loaded example products

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
