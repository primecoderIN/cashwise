"use client";

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";

const PIE_COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"];

type PieData = { name: string; value: number };
type BarData = { month: string; total: number };

type Props = {
  pieData: PieData[];
  barData: BarData[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltipPie = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background border border-border rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-muted-foreground">${Number(payload[0].value).toFixed(2)}</p>
      </div>
    );
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltipBar = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background border border-border rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground">${Number(payload[0].value).toFixed(2)}</p>
      </div>
    );
  }
  return null;
}

export default function DashboardCharts({ pieData, barData }: Props) {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#3f3f46" : "#e2e8f0";
  const textColor = theme === "dark" ? "#71717a" : "#94a3b8";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Spend Bar Chart */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Monthly Spend</h3>
        {barData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltipBar />} cursor={{ fill: "rgba(124,58,237,0.06)" }} />
              <Bar dataKey="total" fill="#7c3aed" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Category Pie Chart */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">By Category</h3>
        {pieData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ color: textColor, fontSize: 12 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
