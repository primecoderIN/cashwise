"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, DollarSign, X } from "lucide-react";
import { addExpense, deleteExpense } from "@/actions/expenseActions";

type ExpenseClientProps = {
  expenses: any[];
  categories: any[];
  groups: any[];
};

export default function ExpenseClient({ expenses, categories, groups }: ExpenseClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [notes, setNotes] = useState("");

  const filteredExpenses = expenses.filter(e => filterCat === "all" || e.categoryId === filterCat);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !categoryId || !date) return;
    setIsSubmitting(true);
    await addExpense({
      title,
      amount: parseFloat(amount),
      date: new Date(date),
      categoryId,
      groupId: groupId || undefined,
      notes,
    });
    setIsSubmitting(false);
    setIsOpen(false);
    // Reset form
    setTitle(""); setAmount(""); setCategoryId(""); setGroupId(""); setNotes("");
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-4 rounded-2xl ring-1 ring-border shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-foreground/70 shrink-0">Filter:</label>
          <select 
            className="w-full sm:w-48 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-full font-medium transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl ring-1 ring-border shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-hover/50 text-xs uppercase tracking-wider text-foreground/60">
              <th className="px-6 py-4 font-semibold rounded-tl-2xl">Date</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Group</th>
              <th className="px-6 py-4 font-semibold text-center rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-foreground/50">
                  No expenses found.
                </td>
              </tr>
            ) : filteredExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-surface-hover/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Calendar className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                    <span>{new Date(exp.date).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{exp.title}</span>
                    {exp.notes && <span className="text-xs text-foreground/50 mt-0.5 line-clamp-1">{exp.notes}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 font-bold text-foreground">
                    <DollarSign className="w-3.5 h-3.5 text-foreground/40" />
                    {exp.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: exp.category.color }} />
                     <span className="text-sm font-medium text-foreground/80">
                       {exp.category.name}
                     </span>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {exp.group ? (
                    <span className="px-2.5 py-1 bg-surface-hover ring-1 ring-border rounded-md text-xs font-medium text-foreground/70">
                      {exp.group.name}
                    </span>
                  ) : (
                    <span className="text-foreground/30">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button 
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm fade-in">
          <div className="bg-surface w-full max-w-md rounded-3xl ring-1 ring-border shadow-2xl overflow-hidden flex flex-col scale-in">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-hover/30">
              <h2 className="text-xl font-bold tracking-tight">Add New Expense</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-surface-hover rounded-full transition-colors text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  placeholder="E.g., Groceries"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/30"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 w-1/2">
                  <label className="text-sm font-medium text-foreground/80">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input 
                      type="number" 
                      step="0.01"
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      required 
                      placeholder="0.00"
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/30"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 w-1/2">
                  <label className="text-sm font-medium text-foreground/80">Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Category</label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)} 
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Group (Optional)</label>
                <select 
                  value={groupId} 
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">None</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Notes</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Extra details..."
                  rows={2}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/30 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-full font-medium text-sm text-foreground/70 hover:bg-surface-hover hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-full font-medium text-sm bg-primary hover:bg-primary-hover text-white transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
