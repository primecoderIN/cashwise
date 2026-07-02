"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Pencil, Search, Download, Receipt, X, DollarSign } from "lucide-react";
import { addExpense, deleteExpense, updateExpense } from "@/actions/expenseActions";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input, { Select, TextArea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import type { Expense, Category, ExpenseGroup, ExpenseFormData } from "@/types";

type Props = {
  expenses: Expense[];
  categories: Category[];
  groups: ExpenseGroup[];
};

const emptyForm: Omit<ExpenseFormData, "date"> & { date: string } = {
  title: "", amount: 0, date: new Date().toISOString().split("T")[0],
  categoryId: "", groupId: "", notes: "",
};

function exportCSV(expenses: Expense[]) {
  const headers = ["Date", "Title", "Amount", "Category", "Group", "Notes"];
  const rows = expenses.map((e) => [
    new Date(e.date).toLocaleDateString(),
    `"${e.title}"`,
    e.amount.toFixed(2),
    e.category.name,
    e.group?.name ?? "",
    `"${e.notes ?? ""}"`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cashwise-expenses-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExpenseClient({ expenses, categories, groups }: Props) {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch]     = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo]   = useState("");

  // Form
  const [form, setForm] = useState(emptyForm);
  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(emptyForm); setIsAddOpen(true); };
  const openEdit = (e: Expense) => {
    setForm({
      title: e.title, amount: e.amount,
      date: new Date(e.date).toISOString().split("T")[0],
      categoryId: e.categoryId, groupId: e.groupId ?? "", notes: e.notes ?? "",
    });
    setEditTarget(e);
  };
  const closeAll = () => { setIsAddOpen(false); setEditTarget(null); };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsSubmitting(true);
    const payload: ExpenseFormData = {
      title: form.title, amount: Number(form.amount),
      date: new Date(form.date),
      categoryId: form.categoryId,
      groupId: form.groupId || undefined,
      notes: form.notes || undefined,
    };
    if (editTarget) {
      const res = await updateExpense(editTarget.id, payload);
      toast(res.success ? "Expense updated!" : (res.error ?? "Failed"), res.success ? "success" : "error");
    } else {
      const res = await addExpense(payload);
      toast(res.success ? "Expense added!" : (res.error ?? "Failed"), res.success ? "success" : "error");
    }
    setIsSubmitting(false);
    closeAll();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteExpense(id);
    toast(res.success ? "Expense deleted." : (res.error ?? "Failed"), res.success ? "info" : "error");
    setDeletingId(null);
  };

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (filterCat !== "all" && e.categoryId !== filterCat) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterFrom && new Date(e.date) < new Date(filterFrom)) return false;
      if (filterTo && new Date(e.date) > new Date(filterTo)) return false;
      return true;
    });
  }, [expenses, filterCat, search, filterFrom, filterTo]);

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const formBody = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. Groceries" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Amount" type="number" step="0.01" min="0" value={form.amount || ""} onChange={(e) => set("amount", e.target.value)} required placeholder="0.00" icon={<DollarSign className="w-4 h-4" />} />
        <Input label="Date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
      </div>
      <Select label="Category" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} required>
        <option value="" disabled>Select category</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </Select>
      <Select label="Group (optional)" value={form.groupId} onChange={(e) => set("groupId", e.target.value)}>
        <option value="">None</option>
        {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
      </Select>
      <TextArea label="Notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Optional details..." rows={2} />
      <div className="flex justify-end gap-3 pt-2 border-t border-border mt-2">
        <Button type="button" variant="ghost" onClick={closeAll}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>
          {editTarget ? "Save Changes" : "Add Expense"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted text-sm mt-1">{expenses.length} total · Showing {filtered.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            className="input-base pl-9"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-base w-full sm:w-44 appearance-none cursor-pointer"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" className="input-base w-full sm:w-40" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
        <input type="date" className="input-base w-full sm:w-40" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
        {(search || filterCat !== "all" || filterFrom || filterTo) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setFilterCat("all"); setFilterFrom(""); setFilterTo(""); }}>
            <X className="w-4 h-4" /> Clear
          </Button>
        )}
      </div>

      {/* Summary strip */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
          <p className="text-sm font-semibold">
            Total: <span className="text-primary">${totalFiltered.toFixed(2)}</span>
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Receipt}
            title="No expenses found"
            description={expenses.length === 0 ? "Add your first expense to get started." : "Try adjusting your filters."}
            action={expenses.length === 0 ? <Button onClick={openAdd}><Plus className="w-4 h-4" />Add Expense</Button> : undefined}
          />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="px-5 py-3.5 font-semibold text-left">Date</th>
                <th className="px-5 py-3.5 font-semibold text-left">Title</th>
                <th className="px-5 py-3.5 font-semibold text-left">Category</th>
                <th className="px-5 py-3.5 font-semibold text-left">Group</th>
                <th className="px-5 py-3.5 font-semibold text-right">Amount</th>
                <th className="px-5 py-3.5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-surface-hover/60 transition-colors group">
                  <td className="px-5 py-3.5 whitespace-nowrap text-muted">
                    {new Date(exp.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-medium text-foreground">{exp.title}</p>
                      {exp.notes && <p className="text-xs text-muted line-clamp-1 mt-0.5">{exp.notes}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <Badge color={exp.category.color}>{exp.category.name}</Badge>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {exp.group ? (
                      <span className="text-xs font-medium text-muted border border-border rounded-md px-2 py-0.5">
                        {exp.group.name}
                      </span>
                    ) : (
                      <span className="text-muted/40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap font-bold">
                    ${exp.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEdit(exp)}
                        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        disabled={deletingId === exp.id}
                        className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        {deletingId === exp.id
                          ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={closeAll} title="Add Expense">{formBody}</Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={closeAll} title="Edit Expense">{formBody}</Modal>
    </div>
  );
}
