import { getExpenses } from "@/actions/expenseActions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TrendingUp, DollarSign, Calendar, Tag } from "lucide-react";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { Card } from "@/components/ui/card";
import type { Expense } from "@/types";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default async function Home() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const expenses = await getExpenses();

  // ── Stats ──────────────────────────────────────────────────────
  const totalAmount = expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0);

  const now = new Date();
  const thisMonthExpenses = expenses.filter((e: Expense) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum: number, e: Expense) => sum + e.amount, 0);

  const avgPerDay = totalAmount / 30;

  // Biggest category
  type CatTotal = { name: string; color: string; amount: number };
  const catTotals = expenses.reduce((acc: Record<string, CatTotal>, e: Expense) => {
    const key = e.categoryId;
    if (!acc[key]) acc[key] = { name: e.category.name, color: e.category.color, amount: 0 };
    acc[key].amount += e.amount;
    return acc;
  }, {} as Record<string, CatTotal>);
  const topCat = (Object.values(catTotals) as CatTotal[]).sort((a, b) => b.amount - a.amount)[0];

  // ── Chart data ─────────────────────────────────────────────────
  const pieData = (Object.values(catTotals) as CatTotal[]).map(({ name, amount }) => ({ name, value: amount }));

  // Last 6 months bar chart
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const barMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    barMap[`${monthNames[d.getMonth()]} ${d.getFullYear()}`] = 0;
  }
  expenses.forEach((e: Expense) => {
    const d = new Date(e.date);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    if (key in barMap) barMap[key] += e.amount;
  });
  const barData = Object.entries(barMap).map(([month, total]) => ({
    month: month.split(" ")[0], // short month name
    total: parseFloat(total.toFixed(2)),
  }));

  // ── Stat cards config ──────────────────────────────────────────
  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalAmount),
      subtext: `${expenses.length} expenses`,
      icon: DollarSign,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "This Month",
      value: formatCurrency(thisMonthTotal),
      subtext: `${thisMonthExpenses.length} this month`,
      icon: Calendar,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      label: "Avg / Day",
      value: formatCurrency(avgPerDay),
      subtext: "last 30 days",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Top Category",
      value: topCat?.name ?? "—",
      subtext: topCat ? formatCurrency(topCat.amount) : "No expenses yet",
      icon: Tag,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      colorDot: topCat?.color,
    },
  ];

  return (
    <div className="flex flex-col gap-8 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Your financial overview at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-5 flex flex-col gap-4 relative overflow-hidden group cursor-default"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-center gap-2 mt-2">
                  {stat.colorDot && (
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stat.colorDot }} />
                  )}
                  <p className="text-2xl font-bold tracking-tight truncate max-w-[160px]">{stat.value}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            {/* decorative gradient blob */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${stat.bg}`} />
          </Card>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts pieData={pieData} barData={barData} />

      {/* Recent Expenses */}
      {expenses.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Expenses</h3>
          <div className="divide-y divide-border">
            {expenses.slice(0, 5).map((e: Expense) => (
              <div key={e.id} className="flex items-center justify-between py-3 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${e.category.color}20` }}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: e.category.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.category.name} · {new Date(e.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="font-bold text-sm shrink-0">{formatCurrency(e.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
