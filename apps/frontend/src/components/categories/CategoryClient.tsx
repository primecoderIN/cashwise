"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Pencil, LayoutGrid, Activity, PieChart as PieChartIcon, TrendingUp, Plane, Utensils, ShoppingBag, Car, Zap, Home, Film, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function CategoryClient() {
  const [search, setSearch] = useState("");

  const COLORS = ['#16a34a', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#64748b'];
  const ICONS = [Plane, Utensils, ShoppingBag, Car, Zap, Home, Film, LayoutGrid];
  const PALETTE = ['#16a34a', '#f97316', '#8b5cf6', '#eab308', '#3b82f6', '#ef4444', '#94a3b8'];

  return (
    <div className="flex flex-col gap-6 fade-in max-w-[1400px] mx-auto p-2">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">Categories</h1>
          <p className="text-slate-500 font-medium mt-1 text-[15px]">Create and manage your expense categories</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-800">Monthly</button>
            <button className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors">Quarterly</button>
            <button className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors">Yearly</button>
          </div>
          <Button className="bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm px-5 font-semibold h-10">
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
         <Card className="p-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-primary">
               <LayoutGrid className="w-4.5 h-4.5" />
             </div>
             <span className="text-xs font-semibold text-slate-500">Total Categories</span>
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-1">12</h3>
           <p className="text-[11px] font-medium text-primary">Active categories</p>
         </Card>
         <Card className="p-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
               <Activity className="w-4.5 h-4.5" />
             </div>
             <span className="text-xs font-semibold text-slate-500">Total Expenses</span>
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-1">₹ 23,550.00</h3>
           <p className="text-[11px] font-medium text-blue-500">All categories</p>
         </Card>
         <Card className="p-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
               <PieChartIcon className="w-4.5 h-4.5" />
             </div>
             <span className="text-xs font-semibold text-slate-500">Top Category</span>
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-1">Flights</h3>
           <p className="text-[11px] font-medium text-purple-500">₹ 4,850.00 (20.6%)</p>
         </Card>
         <Card className="p-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
               <TrendingUp className="w-4.5 h-4.5" />
             </div>
             <span className="text-xs font-semibold text-slate-500">Avg. Spend / Category</span>
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-1">₹ 1,962.50</h3>
           <p className="text-[11px] font-medium text-amber-500">This month</p>
         </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Area - Data Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col bg-white">
             <div className="flex items-center justify-between p-5 border-b border-slate-100">
               <h3 className="text-[15px] font-bold text-slate-900">All Categories</h3>
               <div className="flex items-center gap-3">
                 <div className="relative w-48">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <Input 
                     className="pl-9 bg-slate-50 border-none rounded-lg h-9 shadow-none focus-visible:ring-1 focus-visible:ring-primary/50 text-xs font-medium placeholder:font-normal placeholder:text-slate-400"
                     placeholder="Search categories..."
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                   />
                 </div>
                 <select className="h-9 px-3 bg-slate-50 border-none rounded-lg text-xs font-medium outline-none cursor-pointer text-slate-600">
                   <option>All Groups</option>
                 </select>
               </div>
             </div>
             
             <div className="w-full overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/50">
                   <tr>
                     <th className="px-5 py-4 font-semibold">Category</th>
                     <th className="px-5 py-4 font-semibold">Group</th>
                     <th className="px-5 py-4 font-semibold">Total Expenses</th>
                     <th className="px-5 py-4 font-semibold">% of Total</th>
                     <th className="px-5 py-4 font-semibold text-center">Transactions</th>
                     <th className="px-5 py-4 font-semibold text-center">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {[
                     { name: 'Flights', group: 'Travel', amt: '4,850.00', pct: '20.6%', txn: 6, icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'text-emerald-700 bg-emerald-50' },
                     { name: 'Dining Out', group: 'Food', amt: '3,900.00', pct: '16.6%', txn: 8, icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50', badge: 'text-orange-700 bg-orange-50' },
                     { name: 'Online Shopping', group: 'Shopping', amt: '2,800.00', pct: '11.9%', txn: 5, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50', badge: 'text-purple-700 bg-purple-50' },
                     { name: 'Local Transport', group: 'Travel', amt: '2,350.00', pct: '10.0%', txn: 10, icon: Car, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'text-emerald-700 bg-emerald-50' },
                     { name: 'Electricity Bill', group: 'Bills', amt: '1,850.00', pct: '7.9%', txn: 1, icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'text-blue-700 bg-blue-50' },
                     { name: 'Rent', group: 'Bills', amt: '1,500.00', pct: '6.4%', txn: 1, icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'text-blue-700 bg-blue-50' },
                     { name: 'Movies', group: 'Entertainment', amt: '1,450.00', pct: '6.2%', txn: 4, icon: Film, color: 'text-pink-600', bg: 'bg-pink-50', badge: 'text-amber-700 bg-amber-50' },
                   ].map(c => (
                     <tr key={c.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                       <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg}`}>
                           <c.icon className={`w-4 h-4 ${c.color}`} />
                         </div>
                         {c.name}
                       </td>
                       <td className="px-5 py-4">
                         <Badge className={`border-none ${c.badge}`}>{c.group}</Badge>
                       </td>
                       <td className="px-5 py-4 font-bold text-slate-900">₹ {c.amt}</td>
                       <td className="px-5 py-4 text-slate-600 font-medium">{c.pct}</td>
                       <td className="px-5 py-4 text-slate-600 font-medium text-center">{c.txn}</td>
                       <td className="px-5 py-4 text-center">
                         <div className="flex items-center justify-center gap-1">
                           <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                           <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                         </div>
                       </td>
                     </tr>
                   ))}
                   <tr className="bg-slate-50/50">
                     <td className="px-5 py-4 font-bold text-slate-900" colSpan={2}>Total</td>
                     <td className="px-5 py-4 font-bold text-slate-900">₹ 23,550.00</td>
                     <td className="px-5 py-4 font-bold text-slate-900">100%</td>
                     <td className="px-5 py-4 font-bold text-slate-900 text-center">52</td>
                     <td className="px-5 py-4"></td>
                   </tr>
                 </tbody>
               </table>
             </div>
             
             <div className="p-4 border-t border-slate-100 flex items-center justify-between text-[13px] text-slate-500 bg-slate-50/50">
               <span>Showing 1 to 12 of 12 categories</span>
               <div className="flex items-center gap-1">
                 <button className="px-3 py-1 font-semibold text-slate-400 cursor-not-allowed">&lt; Previous</button>
                 <button className="w-7 h-7 flex items-center justify-center font-bold bg-primary text-white rounded-md shadow-sm">1</button>
                 <button className="px-3 py-1 font-semibold text-slate-400 cursor-not-allowed">Next &gt;</button>
               </div>
             </div>
          </Card>
        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
           <Card className="p-5 shadow-sm border-slate-200 bg-white">
             <div className="flex items-center gap-2 mb-5">
               <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                 <LayoutGrid className="w-4 h-4 text-primary" />
               </div>
               <h3 className="text-[15px] font-bold text-slate-900">Add New Category</h3>
             </div>
             
             <div className="space-y-4">
               <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-semibold text-slate-700">Category Name</label>
                 <Input className="h-10 border-slate-200 shadow-sm focus-visible:ring-primary" placeholder="Enter category name" />
               </div>
               
               <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-semibold text-slate-700">Select Group</label>
                 <select className="h-10 px-3 bg-white border border-slate-200 rounded-md text-sm font-medium outline-none focus:border-primary shadow-sm text-slate-600">
                   <option>Choose a group</option>
                 </select>
               </div>

               <div className="flex flex-col gap-2 pt-2">
                 <label className="text-xs font-semibold text-slate-700">Select Icon</label>
                 <div className="grid grid-cols-5 gap-2">
                   {ICONS.map((IconComp, i) => (
                     <button key={i} className={`h-10 rounded-lg flex items-center justify-center border transition-all ${i === 0 ? 'border-primary bg-emerald-50 text-primary' : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'}`}>
                       <IconComp className="w-4.5 h-4.5" />
                     </button>
                   ))}
                   <button className="h-10 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 font-bold">
                     ...
                   </button>
                 </div>
               </div>

               <div className="flex flex-col gap-2 pt-2 pb-2">
                 <label className="text-xs font-semibold text-slate-700">Icon Color</label>
                 <div className="flex items-center gap-2">
                   {PALETTE.map((color, i) => (
                     <button key={color} className="w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 transition-transform" style={{ backgroundColor: color }}>
                       {i === 0 && <Check className="w-3.5 h-3.5 text-white" />}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="flex gap-3 pt-2">
                 <Button variant="outline" className="flex-1 rounded-xl h-11 font-semibold text-slate-600 border-slate-200">Cancel</Button>
                 <Button className="flex-1 rounded-xl h-11 font-semibold bg-primary hover:bg-primary-hover text-white shadow-sm">Save Category</Button>
               </div>
             </div>
           </Card>
           
           <Card className="p-5 shadow-sm border-slate-200 bg-white">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-[15px] font-bold text-slate-900">Category Summary</h3>
               <select className="text-[11px] bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none text-slate-600 font-semibold cursor-pointer">
                 <option>This Month</option>
               </select>
             </div>
             
             <div className="flex gap-4 items-center">
               <div className="w-32 h-32 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{ name: 'Travel', value: 30.6 }, { name: 'Food', value: 21.9 }, { name: 'Shopping', value: 14.3 }, { name: 'Bills', value: 14.3 }, { name: 'Ent', value: 6.2 }, { name: 'Others', value: 12.7 }]} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                        <Cell fill="#16a34a" />
                        <Cell fill="#f97316" />
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#ec4899" />
                        <Cell fill="#94a3b8" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               
               <div className="flex-1 space-y-2">
                 {[
                   { color: 'bg-primary', name: 'Travel', amt: '7,200.00', pct: '30.6%' },
                   { color: 'bg-orange-500', name: 'Food', amt: '5,150.00', pct: '21.9%' },
                   { color: 'bg-purple-500', name: 'Shopping', amt: '2,800.00', pct: '11.9%' },
                   { color: 'bg-blue-500', name: 'Bills', amt: '3,350.00', pct: '14.3%' },
                   { color: 'bg-pink-500', name: 'Entertainment', amt: '1,450.00', pct: '6.2%' },
                   { color: 'bg-emerald-500', name: 'Health', amt: '1,050.00', pct: '4.5%' },
                   { color: 'bg-slate-400', name: 'Others', amt: '550.00', pct: '2.3%' },
                 ].map(g => (
                   <div key={g.name} className="flex items-center justify-between text-[11px] font-semibold">
                     <div className="flex items-center gap-1.5 w-24">
                       <div className={`w-1.5 h-1.5 rounded-full ${g.color}`} />
                       <span className="text-slate-600 truncate">{g.name}</span>
                     </div>
                     <span className="text-slate-900 w-16 text-right">₹ {g.amt}</span>
                     <span className="text-slate-400 w-8 text-right">{g.pct}</span>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="mt-6 text-center border-t border-slate-100 pt-4">
               <button className="text-[13px] font-semibold text-primary hover:text-primary-hover flex items-center justify-center gap-1.5 w-full">
                 <Activity className="w-3.5 h-3.5" /> View Category Report
               </button>
             </div>
           </Card>
        </div>

      </div>
    </div>
  );
}
