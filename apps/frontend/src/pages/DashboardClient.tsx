import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, FolderGit2, Tags, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardClient() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => api.get('/dashboard/summary').then((res: any) => res.data)
  });

  const { data: charts, isLoading: loadingCharts } = useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: () => api.get('/dashboard/charts').then((res: any) => res.data)
  });

  const { data: recent, isLoading: loadingRecent } = useQuery({
    queryKey: ['dashboard', 'recent'],
    queryFn: () => api.get('/dashboard/recent').then((res: any) => res.data)
  });

  if (loadingSummary || loadingCharts || loadingRecent) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const COLORS = ['#16a34a', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Dashboard 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your money</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <Card className="p-5 flex items-start justify-between shadow-sm border-border/50 bg-white dark:bg-card">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</p>
            <h3 className="text-2xl font-bold">₹ {summary?.totalAmount?.toLocaleString() || '0'}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500">
            <Wallet className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-start justify-between shadow-sm border-border/50 bg-white dark:bg-card">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Monthly Expenses</p>
            <h3 className="text-2xl font-bold">₹ {summary?.monthlyAmount?.toLocaleString() || '0'}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-start justify-between shadow-sm border-border/50 bg-white dark:bg-card">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Highest Group</p>
            <h3 className="text-xl font-bold truncate max-w-[120px]">{summary?.highestGroup?.name || 'None'}</h3>
            <p className="text-xs text-muted-foreground mt-1">₹ {summary?.highestGroup?.amount?.toLocaleString() || '0'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-green-500">
            <FolderGit2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-start justify-between shadow-sm border-border/50 bg-white dark:bg-card">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Highest Category</p>
            <h3 className="text-xl font-bold truncate max-w-[120px]">{summary?.highestCategory?.name || 'None'}</h3>
            <p className="text-xs text-muted-foreground mt-1">₹ {summary?.highestCategory?.amount?.toLocaleString() || '0'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-500">
            <Tags className="w-5 h-5" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 shadow-sm border-border/50 bg-white dark:bg-card">
            <h3 className="text-lg font-semibold mb-6">Expenses Trend (Last 30 Days)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts?.trend || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    stroke="currentColor" className="opacity-50"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(val) => `₹${val}`}
                    stroke="currentColor" className="opacity-50"
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`₹${value}`, 'Amount']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#16a34a', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-border/50 bg-white dark:bg-card">
            <h3 className="text-lg font-semibold mb-6">Recent Expenses</h3>
            <div className="space-y-4">
              {recent?.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No recent expenses found.</p>
              ) : (
                recent?.map((expense: any) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-surface-hover rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: expense.category.color }}>
                        {/* Should use Lucide icon here dynamically, placeholder for now */}
                        {expense.category.icon.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{expense.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()} • {expense.group?.name || 'Other'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-500">- ₹ {expense.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{expense.category.name}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Charts */}
        <div className="space-y-6">
          <Card className="p-6 shadow-sm border-border/50 bg-white dark:bg-card">
            <h3 className="text-lg font-semibold mb-6">Expenses by Category</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts?.byCategory || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts?.byCategory?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => [`₹${value}`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 shadow-sm border-border/50 bg-white dark:bg-card">
            <h3 className="text-lg font-semibold mb-6">Expenses by Group</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts?.byGroup || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts?.byGroup?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => [`₹${value}`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
