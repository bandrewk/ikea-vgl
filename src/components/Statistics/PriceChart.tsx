import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { IkeaItem } from "../../types/item";
import classes from "./PriceChart.module.css";

interface PriceChartProps {
  items: IkeaItem[];
}

export default function PriceChart({ items }: PriceChartProps) {
  const data = items
    .filter((item) => item.priceDE > 0 && item.pricePLNInEur > 0)
    .map((item) => ({
      name: item.name.length > 18 ? item.name.slice(0, 18) + "…" : item.name,
      DE: item.priceDE,
      PL: item.pricePLNInEur,
    }));

  if (data.length === 0) return null;

  return (
    <div className={classes.chart}>
      <p className={classes.label}>Preisvergleich</p>
      <div style={{ width: "100%", height: Math.max(240, data.length * 44) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "var(--text-3)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={130}
              tick={{ fontSize: 11, fill: "var(--text-2)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => `€ ${value.toFixed(2)}`}
              cursor={{ fill: "var(--border)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-lg)",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="DE"
              fill="var(--blue)"
              name="🇩🇪 DE"
              radius={[0, 6, 6, 0]}
            />
            <Bar
              dataKey="PL"
              fill="var(--yellow)"
              name="🇵🇱 PL"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
