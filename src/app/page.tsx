import { getExpenses } from "@/actions/expenseActions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const expenses = await getExpenses();
  const totalAmount = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);

  // Group by category
  const categoryTotals = expenses.reduce((acc, exp: any) => {
    const catName = exp.category?.name || "Uncategorized";
    acc[catName] = (acc[catName] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(categoryTotals).map((name) => ({
    name,
    value: categoryTotals[name],
  }));

  return (
    <div className="flex flex-col gap-6 fade-in container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-2xl p-6 shadow-sm ring-1 ring-border transition-all hover:shadow-md hover:ring-primary/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
          <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-2">Total Expenses</p>
          <h2 className="text-4xl font-bold text-foreground">
            ${totalAmount.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="mt-8 bg-surface rounded-2xl p-6 shadow-sm ring-1 ring-border">
        <h3 className="text-xl font-semibold mb-6 tracking-tight">Category Breakdown</h3>
        {chartData.length > 0 ? (
          <DashboardCharts data={chartData} />
        ) : (
          <div className="h-64 flex flex-col items-center justify-center bg-surface-hover rounded-xl border border-dashed border-border/50">
            <p className="text-foreground/50 font-medium">No expenses recorded yet.</p>
            <p className="text-sm text-foreground/40 mt-1">Add your first expense to see the breakdown.</p>
          </div>
        )}
      </div>
    </div>
  );
}
