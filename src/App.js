import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Statistics from "./components/Layout/Statistics";

import { useEffect, useState, useCallback } from "react";
import {
  API_URL_DE,
  API_URL_PLN,
  EUR_TO_PLN_RATE_AVG,
} from "./components/config";
import Input from "./components/Layout/Input";
import ItemList from "./components/Item/ItemList";

function App() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    totalPriceDE: 0,
    totalPricePLEur: 0,
    totalDiscountInPercentage: 0,
    totalDiscount: 0,
    totalItems: 0,
  });

  /* Load items from storage */
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("ikea-items"));

    if (items) {
      setItems(items);
    }
  }, []);

  /**
   * Update sidebar stats.
   */
  const updateStats = () => {
    // Calculate total prices
    let totalDEEur = 0;
    let totalPLEur = 0;

    for (let item of items) {
      // Exclude items that aren't available in both stores.
      if (+item.priceDE > 0 && +item.pricePLNInEur > 0) {
        totalDEEur += +item.priceDE;
        totalPLEur += +item.pricePLNInEur;
      }
    }

    const totalSaved = totalDEEur - totalPLEur;
    let totalDiscountInPercentage =
      ((100 / totalDEEur) * totalPLEur - 100).toFixed(2) * -1;

    // Fix NaN on invalid items
    if (isNaN(totalDiscountInPercentage)) totalDiscountInPercentage = 0;

    // Update data
    setStats({
      totalPriceDE: totalDEEur.toFixed(2),
      totalPricePLEur: totalPLEur.toFixed(2),
      totalDiscountInPercentage:
        items.length > 0 ? totalDiscountInPercentage : 0,
      totalDiscount: totalSaved.toFixed(2),
      totalItems: items.length,
    });

    /* Save items to storage */
    localStorage.setItem("ikea-items", JSON.stringify(items));
  };

  useEffect(updateStats, [items]);

  /**
   * Fetches article data from IKEA PL.
   * @param {object} item Constructed item object by fetched data from IKEA DE
   */
  const getPLNStorePrice = useCallback((item) => {
    fetch(`${API_URL_PLN}?q=${item.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Response from IKEA PLN not ok`, response);
        }

        return response.json();
      })
      .then((data) => {
        try {
          const artikelArray = [...data.searchResultPage.products.main.items];
          const artikel = artikelArray[0].product;

          const foreignPrice = artikel.priceNumeral.toFixed(2);
          const priceInEUR = (foreignPrice / EUR_TO_PLN_RATE_AVG).toFixed(2);

          item.pricePLN = foreignPrice;
          item.pricePLNInEur = priceInEUR;
          item.discountInPercentage = (
            (100 / item.priceDE) * item.pricePLNInEur -
            100
          ).toFixed(2);

          if (item.discountInPercentage > 0) item.cheaperInPLN = false;

          setItems((prevState) => {
            return [item, ...prevState];
          });
        } catch (error) {
          throw new Error(`Artikel nicht gefunden!`, error);
        }
      })
      .catch((error) => {
        // Found in DE but not in PLN
        setItems((prevState) => {
          item.notFoundPL = true;
          item.cheaperInPLN = false;
          return [item, ...prevState];
        });
      });
  }, []);

  /**
   * Adds a new article to the app and starts fetching price and product data from IKEA DE and PL.
   * @param {number} newItem IKEA ArticleId of the item to add
   */
  const addItemHandler = useCallback(
    (newItem) => {
      fetch(`${API_URL_DE}?q=${newItem}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Response from IKEA is not ok.`);
          }

          return response.json();
        })
        .then((data) => {
          try {
            const artikelArray = [...data.searchResultPage.products.main.items];
            const artikel = artikelArray[0].product;

            // Create an object and pass it to the next store function.
            getPLNStorePrice({
              key: Math.random().toString(),
              id: newItem,
              name: `${artikel.name} ${artikel.typeName}`,
              priceDE: artikel.priceNumeral.toFixed(2),
              pricePLN: 0,
              pricePLNInEur: 0,
              pricePLNFamily: 0, // I swear I saw them family prices in the JSON response from IKEA at some point but I wasn't able to find them again. Stays here but is unused atm.
              pricePLNFamilyInEur: 0,
              priceDiffInEur: 0,
              discountInPercentage: 0,
              cheaperInPLN: true,
              url: artikel.pipUrl,
              notFoundDE: false,
              notFoundPL: false,
            });
          } catch (error) {
            throw new Error(`Artikel nicht gefunden!`, error);
          }
        })
        .catch((error) => {
          setItems((prevState) => {
            return [
              {
                key: Math.random().toString(),
                id: newItem,
                notFoundDE: true,
                notFoundPL: true,
                name: "",
                priceDE: 0,
                pricePLN: 0,
                pricePLNInEur: 0,
                pricePLNFamily: 0,
                pricePLNFamilyInEur: 0,
                priceDiffInEur: 0,
                discountInPercentage: 0,
              },
              ...prevState,
            ];
          });
        });
    },
    [getPLNStorePrice]
  );

  /**
   * Loads demo data when requested with hardcoded article ids
   */
  const loadDemoDataHandler = () => {
    if (items.length === 0) {
      addItemHandler("50205481");
      addItemHandler("00205501");
      addItemHandler("80242745"); // not available in PL but in DE
      addItemHandler("70401952"); // decimal
      addItemHandler("50205495");
      addItemHandler("20475610");
      addItemHandler("80417759");
      addItemHandler("60205664");
      addItemHandler("09158190"); // not available in PL but in DE
      addItemHandler("12312312"); // invalid
      addItemHandler("60335199");
    }
  };
  /**
   * Removes an item from the app
   * @param {number} itemKey Item identifier key. When null all items will be removed.
   */
  const removeItemHandler = (itemKey) => {
    // Clear all items?
    if (itemKey === null) {
      setItems([]);
      localStorage.clear();
    }

    // Remove single item
    //console.log(`Item ${itemKey} wishes to be removed.`);

    setItems((prevState) => {
      const newArray = prevState.filter((item) => item.key !== itemKey);
      return newArray;
    });
  };

  return (
    <>
      <Header />
      <main>
        <Input addItemHandler={addItemHandler} />
        <ItemList items={items} removeItemHandler={removeItemHandler} />
        <Statistics stats={stats} />
      </main>
      <Footer loadDemoHandler={loadDemoDataHandler} />
    </>
  );
}

export default App;
