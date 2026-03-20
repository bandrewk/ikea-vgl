import Layout from "./components/Layout/Layout";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import InputSection from "./components/Input/InputSection";
import ItemGrid from "./components/Items/ItemGrid";
import StatisticsPanel from "./components/Statistics/StatisticsPanel";
import PriceChart from "./components/Statistics/PriceChart";
import ExportPanel from "./components/Export/ExportPanel";
import { useExchangeRate } from "./hooks/useExchangeRate";
import { useIkeaSearch } from "./hooks/useIkeaSearch";
import classes from "./App.module.css";

export default function App() {
  const { exchangeRate } = useExchangeRate();
  const { items, stats, addItem, removeItem, loadDemoData, setItems } =
    useIkeaSearch(exchangeRate);

  const hasItems = items.length > 0;

  return (
    <Layout>
      <Header />
      <main>
        {/* Top bento row: Input + Stats */}
        <div className={classes.bentoTop}>
          <div className={classes.inputCard}>
            <InputSection onAddItem={addItem} />
          </div>
          {hasItems && (
            <div className={classes.statsCard}>
              <StatisticsPanel stats={stats} />
            </div>
          )}
        </div>

        {/* Items grid */}
        <ItemGrid items={items} onRemoveItem={removeItem} />

        {/* Bottom bento row: Chart + Export */}
        {hasItems && (
          <div className={classes.bentoBottom}>
            <div className={classes.chartCard}>
              <PriceChart items={items} />
            </div>
            <div className={classes.exportCard}>
              <ExportPanel items={items} stats={stats} onImport={setItems} />
            </div>
          </div>
        )}
      </main>
      <Footer exchangeRate={exchangeRate} onLoadDemo={loadDemoData} />
    </Layout>
  );
}
