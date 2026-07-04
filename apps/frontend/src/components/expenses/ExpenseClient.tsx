"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Download, Wallet, CreditCard, Activity, FolderGit2, Calendar, LayoutGrid, ListFilter, MoreHorizontal, Pencil, Trash2, X, CloudUpload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useForm, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

// Note: these should ideally come from shared types
export type CategoryLocal = { id: string; name: string; color: string; icon: string; createdAt: Date };
export type ExpenseGroupLocal = { id: string; name: string; description: string | null; createdAt: Date };
export type ExpenseLocal = { id: string; title: string; amount: number; date: Date; categoryId: string; category: CategoryLocal; groupId: string | null; group: ExpenseGroupLocal | null; notes: string | null; createdAt: Date };

export default function ExpenseClient() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: expenses = [] } = useQuery<ExpenseLocal[]>({
    queryKey: ["expenses"],
    queryFn: () => api.get("/expenses").then((res: any) => res.data),
  });

  const { data: categories = [] } = useQuery<CategoryLocal[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res: any) => res.data),
  });

  const { data: groups = [] } = useQuery<ExpenseGroupLocal[]>({
    queryKey: ["groups"],
    queryFn: () => api.get("/groups").then((res: any) => res.data),
  });

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [expenses, search]);

  const COLORS = ['#16a34a', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#64748b'];

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      title: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
      groupId: "",
      notes: ""
    }
  });

  const onSubmit = (data: any) => {
    // Add dummy submit handler to close modal
    setIsAddOpen(false);
  };

  const formBody = (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-900">Date <span className="text-red-500">*</span></label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input type="date" {...register("date")} className="pl-9 h-11 bg-white border-slate-200 rounded-xl text-slate-900 focus-visible:ring-primary shadow-sm" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-900">Amount <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">₹</span>
            <Input type="number" step="0.01" {...register("amount")} placeholder="0.00" className="pl-8 h-11 bg-white border-slate-200 rounded-xl text-slate-900 focus-visible:ring-primary shadow-sm" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-900">Description <span className="text-red-500">*</span></label>
        <Input {...register("title")} placeholder="Enter expense description" className="h-11 bg-white border-slate-200 rounded-xl text-slate-900 focus-visible:ring-primary shadow-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-900">Group</label>
          <div className="relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 bg-slate-100 rounded-sm flex items-center justify-center z-10">
               <FolderGit2 className="w-3 h-3" />
             </div>
             <Controller name="groupId" control={control} render={({field}) => (
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                 <SelectTrigger className="h-11 w-full pl-9 pr-3 bg-white border-slate-200 rounded-xl text-sm font-medium shadow-sm text-slate-700">
                   <SelectValue placeholder="Select group (optional)" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="none">Select group (optional)</SelectItem>
                   {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                 </SelectContent>
               </Select>
             )} />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-tight">If no group is selected, expense will be added to 'Other' group.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-900">Category <span className="text-red-500">*</span></label>
          <div className="relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 bg-slate-100 rounded-sm flex items-center justify-center z-10">
               <LayoutGrid className="w-3 h-3" />
             </div>
             <Controller name="categoryId" control={control} render={({field}) => (
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                 <SelectTrigger className="h-11 w-full pl-9 pr-3 bg-white border-slate-200 rounded-xl text-sm font-medium shadow-sm text-slate-700">
                   <SelectValue placeholder="Select category" />
                 </SelectTrigger>
                 <SelectContent>
                   {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                 </SelectContent>
               </Select>
             )} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-900">Payment Mode <span className="text-red-500">*</span></label>
          <Select defaultValue="none">
            <SelectTrigger className="h-11 w-full bg-white border-slate-200 rounded-xl text-sm font-medium shadow-sm text-slate-700">
              <SelectValue placeholder="Select payment mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select payment mode</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-900">Account <span className="text-red-500">*</span></label>
          <Select defaultValue="none">
            <SelectTrigger className="h-11 w-full bg-white border-slate-200 rounded-xl text-sm font-medium shadow-sm text-slate-700">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select account</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-900">Merchant / Payee</label>
        <Input placeholder="Enter merchant or payee name (optional)" className="h-11 bg-white border-slate-200 rounded-xl text-slate-900 focus-visible:ring-primary shadow-sm" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-900">Notes (Optional)</label>
        <Textarea {...register("notes")} placeholder="Add any additional notes..." rows={2} className="bg-white border-slate-200 rounded-xl text-slate-900 focus-visible:ring-primary shadow-sm resize-none" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-900">Attach Receipt (Optional)</label>
        <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
          <div className="flex items-center gap-2 mb-1">
            <CloudUpload className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-sm font-bold text-slate-700">Click to upload or drag & drop</span>
          </div>
          <p className="text-[11px] font-medium text-slate-400">JPG, PNG, PDF up to 5MB</p>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-6 pb-2">
        <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl h-12 px-8 font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 w-32 shadow-sm">
          Cancel
        </Button>
        <Button type="submit" className="rounded-xl h-12 px-8 font-semibold bg-primary hover:bg-primary-hover text-white shadow-sm flex-1 max-w-[200px]">
          Save Expense
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6 fade-in max-w-[1400px] mx-auto p-2">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">Expenses</h1>
          <p className="text-slate-500 font-medium mt-1 text-[15px]">Track and manage your expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-800">Monthly</button>
            <button className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors">Quarterly</button>
            <button className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors">Yearly</button>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm px-5 font-semibold h-10">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-2 border-b border-slate-100 pb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            className="pl-9 bg-slate-50 border-none rounded-xl h-10 shadow-none focus-visible:ring-1 focus-visible:ring-primary/50 font-medium placeholder:font-normal placeholder:text-slate-400"
            placeholder="Search description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
             <span className="text-[11px] font-semibold text-slate-500 ml-1">Group</span>
             <Select defaultValue="all">
               <SelectTrigger className="h-10 w-[140px] bg-white border-slate-200 rounded-xl text-sm font-medium shadow-sm">
                 <SelectValue placeholder="All Groups" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Groups</SelectItem>
               </SelectContent>
             </Select>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[11px] font-semibold text-slate-500 ml-1">Category</span>
             <Select defaultValue="all">
               <SelectTrigger className="h-10 w-[140px] bg-white border-slate-200 rounded-xl text-sm font-medium shadow-sm">
                 <SelectValue placeholder="All Categories" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Categories</SelectItem>
               </SelectContent>
             </Select>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[11px] font-semibold text-slate-500 ml-1">Payment Mode</span>
             <Select defaultValue="all">
               <SelectTrigger className="h-10 w-[160px] bg-white border-slate-200 rounded-xl text-sm font-medium shadow-sm">
                 <SelectValue placeholder="All Payment Modes" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Payment Modes</SelectItem>
               </SelectContent>
             </Select>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[11px] font-semibold text-slate-500 ml-1">Account</span>
             <Select defaultValue="all">
               <SelectTrigger className="h-10 w-[140px] bg-white border-slate-200 rounded-xl text-sm font-medium shadow-sm">
                 <SelectValue placeholder="All Accounts" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Accounts</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </div>
        <div className="ml-auto mt-5">
           <Button variant="outline" className="h-10 rounded-xl border-slate-200 shadow-sm font-semibold gap-2">
             <ListFilter className="w-4 h-4" />
             More Filters
           </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Area - Data */}
        <div className="lg:col-span-3 space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-4 gap-4">
             <Card className="p-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-primary">
                   <Wallet className="w-4.5 h-4.5" />
                 </div>
                 <span className="text-xs font-semibold text-slate-500">Total Expenses</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">₹ 23,550.00</h3>
               <p className="text-[11px] font-medium text-red-500">▲ 8.2% <span className="text-slate-400">vs Apr 1 - Apr 30</span></p>
             </Card>
             <Card className="p-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                   <Activity className="w-4.5 h-4.5" />
                 </div>
                 <span className="text-xs font-semibold text-slate-500">Total Transactions</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">32</h3>
               <p className="text-[11px] font-medium text-green-500">▼ 3 <span className="text-slate-400">vs Apr 1 - Apr 30</span></p>
             </Card>
             <Card className="p-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                   <Activity className="w-4.5 h-4.5" />
                 </div>
                 <span className="text-xs font-semibold text-slate-500">Daily Average</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">₹ 759.68</h3>
               <p className="text-[11px] font-medium text-green-500">▼ 5.3% <span className="text-slate-400">vs last month</span></p>
             </Card>
             <Card className="p-4 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                   <FolderGit2 className="w-4.5 h-4.5" />
                 </div>
                 <span className="text-xs font-semibold text-slate-500">Highest Expense</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">₹ 4,850.00</h3>
               <p className="text-[11px] font-medium text-slate-500">Flights - May 29, 2025</p>
             </Card>
          </div>

          {/* Table Area */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
             <div className="flex items-center justify-between p-4 border-b border-slate-100">
               <div className="flex items-center gap-6">
                 <button className="text-sm font-bold text-primary border-b-2 border-primary pb-4 -mb-4">All Expenses</button>
                 <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors pb-4 -mb-4 flex items-center gap-2">
                   Needs Review <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-600 text-[10px]">2</span>
                 </button>
               </div>
               <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-semibold">
                   Export <Download className="w-3 h-3 ml-2" />
                 </Button>
                 <Button variant="outline" size="sm" className="h-8 rounded-lg w-8 p-0 flex items-center justify-center">
                   <LayoutGrid className="w-4 h-4 text-slate-500" />
                 </Button>
                 <Select defaultValue="newest">
                   <SelectTrigger className="h-8 text-xs bg-white border-slate-200 rounded-lg font-semibold w-[120px]">
                     <SelectValue placeholder="Sort by" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="newest">Date: Newest</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
             
             <div className="flex-1 w-full overflow-x-auto">
               <Table>
                 <TableHeader className="bg-slate-50/50">
                   <TableRow>
                     <TableHead className="w-10">
                       <Checkbox />
                     </TableHead>
                     <TableHead>Date</TableHead>
                     <TableHead>Description</TableHead>
                     <TableHead>Group</TableHead>
                     <TableHead>Category</TableHead>
                     <TableHead>Payment Mode</TableHead>
                     <TableHead>Account</TableHead>
                     <TableHead className="text-right">Amount</TableHead>
                     <TableHead className="text-center w-10"></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {/* Dummy row representing mockup */}
                   <TableRow>
                     <TableCell><Checkbox /></TableCell>
                     <TableCell className="text-slate-600 whitespace-nowrap">May 31, 2025</TableCell>
                     <TableCell className="font-bold text-slate-900 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">U</div>
                       Uber Ride
                     </TableCell>
                     <TableCell><Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">Travel</Badge></TableCell>
                     <TableCell className="text-slate-600">Local Transport</TableCell>
                     <TableCell className="text-slate-900 font-medium"><div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-purple-600" /> UPI</div></TableCell>
                     <TableCell className="text-slate-600">HDFC Bank</TableCell>
                     <TableCell className="text-right font-bold text-red-500">- ₹ 320.00</TableCell>
                     <TableCell className="text-center"><MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-900" /></TableCell>
                   </TableRow>
                   <TableRow>
                     <TableCell><Checkbox /></TableCell>
                     <TableCell className="text-slate-600 whitespace-nowrap">May 30, 2025</TableCell>
                     <TableCell className="font-bold text-slate-900 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">L</div>
                       Lunch with Friends
                     </TableCell>
                     <TableCell><Badge className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-none">Food</Badge></TableCell>
                     <TableCell className="text-slate-600">Dining Out</TableCell>
                     <TableCell className="text-slate-900 font-medium"><div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-600" /> Credit Card</div></TableCell>
                     <TableCell className="text-slate-600">HDFC Bank</TableCell>
                     <TableCell className="text-right font-bold text-red-500">- ₹ 650.00</TableCell>
                     <TableCell className="text-center"><MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-900" /></TableCell>
                   </TableRow>
                   {filtered.map(exp => (
                     <TableRow key={exp.id}>
                       <TableCell><Checkbox /></TableCell>
                       <TableCell className="text-slate-600 whitespace-nowrap">{new Date(exp.date).toLocaleDateString()}</TableCell>
                       <TableCell className="font-bold text-slate-900 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs" style={{ backgroundColor: exp.category.color || '#16a34a' }}>
                           {exp.title.charAt(0)}
                         </div>
                         {exp.title}
                       </TableCell>
                       <TableCell>
                         {exp.group && <Badge variant="outline" className="border-none bg-slate-100 text-slate-700">{exp.group.name}</Badge>}
                       </TableCell>
                       <TableCell className="text-slate-600">{exp.category.name}</TableCell>
                       <TableCell className="text-slate-900 font-medium">UPI</TableCell>
                       <TableCell className="text-slate-600">Bank</TableCell>
                       <TableCell className="text-right font-bold text-red-500">- ₹ {exp.amount.toFixed(2)}</TableCell>
                       <TableCell className="text-center"><MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-900" /></TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
             
             <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
               <span>Showing 1 to 10 of 32 expenses</span>
               <div className="flex items-center gap-1">
                 <button className="px-3 py-1.5 font-semibold hover:bg-slate-200 rounded-md transition-colors">&lt; Previous</button>
                 <button className="w-8 h-8 flex items-center justify-center font-bold bg-primary text-white rounded-md shadow-sm">1</button>
                 <button className="w-8 h-8 flex items-center justify-center font-semibold hover:bg-slate-200 rounded-md">2</button>
                 <button className="w-8 h-8 flex items-center justify-center font-semibold hover:bg-slate-200 rounded-md">3</button>
                 <span className="mx-1">...</span>
                 <button className="px-3 py-1.5 font-semibold hover:bg-slate-200 rounded-md transition-colors">Next &gt;</button>
               </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
           <Card className="p-5 shadow-sm border-slate-200 bg-white">
             <h3 className="text-[15px] font-bold text-slate-900 mb-6">Expenses by Group</h3>
             <div className="h-[200px] w-full relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: 'Travel', value: 35.9 }, { name: 'Food', value: 23.6 }, { name: 'Shopping', value: 15.1 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      <Cell fill="#16a34a" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#8b5cf6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[16px] font-bold text-slate-900">₹ 23,550</span>
                  <span className="text-[11px] font-semibold text-slate-500">Total</span>
                </div>
             </div>
             
             <div className="space-y-3">
               {[
                 { color: 'bg-primary', name: 'Travel', pct: '35.9%' },
                 { color: 'bg-amber-500', name: 'Food', pct: '23.6%' },
                 { color: 'bg-purple-500', name: 'Shopping', pct: '15.1%' },
                 { color: 'bg-blue-500', name: 'Bills', pct: '10.6%' },
               ].map(g => (
                 <div key={g.name} className="flex items-center justify-between text-xs font-semibold">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${g.color}`} />
                     <span className="text-slate-700">{g.name}</span>
                   </div>
                   <span className="text-slate-900">{g.pct}</span>
                 </div>
               ))}
             </div>
             
             <div className="mt-6 text-center">
               <button className="text-sm font-semibold text-primary hover:text-primary-hover">View Full Report</button>
             </div>
           </Card>

           <Card className="p-5 shadow-sm border-slate-200 bg-white">
             <h3 className="text-[15px] font-bold text-slate-900 mb-5">Expenses by Payment Mode</h3>
             <div className="space-y-4">
               {[
                 { name: 'UPI', amount: '8,250.00', pct: '35.0%', icon: 'U', color: 'text-purple-600 bg-purple-50', bar: 'bg-purple-500 w-[35%]' },
                 { name: 'Credit Card', amount: '7,650.00', pct: '32.5%', icon: 'C', color: 'text-blue-600 bg-blue-50', bar: 'bg-blue-500 w-[32%]' },
                 { name: 'Net Banking', amount: '4,250.00', pct: '18.1%', icon: 'N', color: 'text-emerald-600 bg-emerald-50', bar: 'bg-emerald-500 w-[18%]' },
               ].map(pm => (
                 <div key={pm.name} className="flex flex-col gap-2">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${pm.color}`}>{pm.icon}</div>
                       <span className="text-sm font-semibold text-slate-700">{pm.name}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                       <span className="font-bold text-slate-900">₹ {pm.amount}</span>
                       <span className="text-slate-400 font-medium text-[11px] w-8 text-right">{pm.pct}</span>
                     </div>
                   </div>
                   <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${pm.bar}`} />
                   </div>
                 </div>
               ))}
             </div>
             <div className="mt-6 text-center">
               <button className="text-sm font-semibold text-primary hover:text-primary-hover">View Full Report</button>
             </div>
           </Card>

           <Card className="p-5 shadow-sm border-slate-200 bg-white">
             <h3 className="text-[15px] font-bold text-slate-900 mb-5">Recent Groups</h3>
             <div className="space-y-3">
               {[
                 { name: 'Travel', amount: '8,450.00', icon: <FolderGit2 className="w-4 h-4 text-emerald-600"/>, color: 'bg-emerald-50' },
                 { name: 'Food', amount: '5,550.00', icon: <Activity className="w-4 h-4 text-amber-600"/>, color: 'bg-amber-50' },
                 { name: 'Shopping', amount: '3,550.00', icon: <Wallet className="w-4 h-4 text-purple-600"/>, color: 'bg-purple-50' },
               ].map(g => (
                 <div key={g.name} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${g.color}`}>
                       {g.icon}
                     </div>
                     <span className="text-sm font-semibold text-slate-700">{g.name}</span>
                   </div>
                   <span className="font-bold text-sm text-slate-900">₹ {g.amount}</span>
                 </div>
               ))}
             </div>
             <div className="mt-6 text-center">
               <button className="text-sm font-semibold text-primary hover:text-primary-hover">Manage Groups</button>
             </div>
           </Card>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[550px] p-6 gap-0 bg-white border-0 shadow-2xl rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
             <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Add Expense</DialogTitle>
             <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-1 rounded-md transition-colors">
               <X className="w-5 h-5" />
             </button>
          </div>
          {formBody}
        </DialogContent>
      </Dialog>
    </div>
  );
}
