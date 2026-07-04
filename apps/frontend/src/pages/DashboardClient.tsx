import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, TrendingUp, FolderGit2, Tags, Receipt, Activity, CreditCard, PieChart as PieChartIcon } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
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

  const COLORS = ['#16a34a', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#64748b'];

  return (
    <div className="space-y-6 fade-in max-w-[1400px] mx-auto p-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Dashboard 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Here's what's happening with your money</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
            May 1 - May 31, 2025
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-primary-hover transition-colors flex items-center gap-2">
            + Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
        <Card className="p-5 flex items-start gap-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Expenses</p>
            <h3 className="text-[22px] font-bold text-slate-900">₹ {summary?.totalAmount?.toLocaleString() || '23,550.00'}</h3>
            <p className="text-xs font-medium text-red-500 mt-1 flex items-center gap-1">
              ▲ 8.2% <span className="text-slate-400 font-normal">vs Apr 1 - Apr 30</span>
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-start gap-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Transactions</p>
            <h3 className="text-[22px] font-bold text-slate-900">32</h3>
            <p className="text-xs font-medium text-green-500 mt-1 flex items-center gap-1">
              ▼ 3 <span className="text-slate-400 font-normal">vs Apr 1 - Apr 30</span>
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-start gap-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Daily Average</p>
            <h3 className="text-[22px] font-bold text-slate-900">₹ 759.68</h3>
            <p className="text-xs font-medium text-green-500 mt-1 flex items-center gap-1">
              ▼ 5.3% <span className="text-slate-400 font-normal">vs last month</span>
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-start gap-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-primary shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Top Group</p>
            <h3 className="text-[22px] font-bold text-slate-900 truncate max-w-[140px]">{summary?.highestGroup?.name || 'Travel'}</h3>
            <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
              ₹ {summary?.highestGroup?.amount?.toLocaleString() || '8,450.00'} <span className="text-slate-400 font-normal">(35.9%)</span>
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 shadow-sm border-slate-200 bg-white flex flex-col">
              <h3 className="text-[15px] font-bold text-slate-900 mb-6">Expenses Overview</h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts?.byCategory?.length ? charts.byCategory : [{ name: 'Travel', value: 35.9 }, { name: 'Food', value: 23.6 }, { name: 'Shopping', value: 15.1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {(charts?.byCategory || [1,2,3]).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [`₹${value}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-semibold text-slate-500">Total</span>
                    <span className="text-[17px] font-bold text-slate-900">₹ 23,550</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-sm border-slate-200 bg-white flex flex-col">
              <h3 className="text-[15px] font-bold text-slate-900 mb-6">Expenses Trend</h3>
              <div className="flex-1 w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts?.trend || []} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: '#94a3b8' }} 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickLine={false}
                      axisLine={false} 
                      tickFormatter={(val) => `₹${val/1000}k`}
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                      formatter={(value: any) => [`₹${value}`, 'Amount']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#16a34a" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#ffffff' }}
                      activeDot={{ r: 6, fill: '#16a34a', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Recent Expenses */}
          <Card className="p-0 shadow-sm border-slate-200 bg-white overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900">Recent Expenses</h3>
              <button className="text-sm font-semibold text-primary hover:text-primary-hover">View All</button>
            </div>
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">No recent expenses.</TableCell>
                    </TableRow>
                  ) : (
                    recent?.slice(0, 5).map((expense: any) => (
                      <TableRow key={expense.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="font-medium flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: expense.category.color || '#16a34a' }}>
                             {expense.category.name.charAt(0)}
                           </div>
                           {expense.title}
                        </TableCell>
                        <TableCell>
                           <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-semibold">
                             {expense.group?.name || 'General'}
                           </span>
                        </TableCell>
                        <TableCell>{expense.category.name}</TableCell>
                        <TableCell className="text-right font-semibold text-red-500 whitespace-nowrap">
                          - ₹ {expense.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
          <Card className="p-5 shadow-sm border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-slate-900">Quick Filters</h3>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200 w-[120px]">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <FolderGit2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-slate-900">Travel</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-900">₹ 8,450.00</p>
                  <p className="text-[11px] text-slate-500 font-medium">35.9%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <PieChartIcon className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="font-semibold text-sm text-slate-900">Food</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-900">₹ 5,550.00</p>
                  <p className="text-[11px] text-slate-500 font-medium">23.6%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Tags className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="font-semibold text-sm text-slate-900">Shopping</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-900">₹ 3,550.00</p>
                  <p className="text-[11px] text-slate-500 font-medium">15.1%</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button className="text-sm font-semibold text-primary hover:text-primary-hover">View All</button>
            </div>
          </Card>
          
          <Card className="p-5 shadow-sm border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-slate-900">Top Categories</h3>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200 w-[120px]">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
               {[
                 { name: 'Flights', amount: '4,850.00', pct: '20.6%' },
                 { name: 'Dining Out', amount: '3,900.00', pct: '16.6%' },
                 { name: 'Online Shopping', amount: '2,800.00', pct: '11.9%' },
                 { name: 'Local Transport', amount: '2,350.00', pct: '10.0%' },
                 { name: 'Utilities', amount: '2,250.00', pct: '9.6%' },
               ].map(cat => (
                 <div key={cat.name} className="flex items-center justify-between text-sm">
                   <span className="font-medium text-slate-700">{cat.name}</span>
                   <div className="flex items-center gap-3">
                     <span className="font-bold text-slate-900">₹ {cat.amount}</span>
                     <span className="text-slate-400 font-medium text-xs w-10 text-right">{cat.pct}</span>
                   </div>
                 </div>
               ))}
            </div>
            <div className="mt-6 text-center">
              <button className="text-sm font-semibold text-primary hover:text-primary-hover">View All Categories</button>
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-slate-900">Budget Summary</h3>
              <Select defaultValue="month">
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200 w-[120px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Total Budget</span>
                <span className="font-bold text-slate-900">₹ 40,000.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Spent</span>
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-slate-900">₹ 23,550.00</span>
                  <span className="text-slate-400 text-xs">58.9%</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-1">
                <div className="bg-primary h-full rounded-full" style={{ width: '58.9%' }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
