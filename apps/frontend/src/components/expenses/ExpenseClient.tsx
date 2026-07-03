"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Pencil, Search, Download, Receipt, X, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExpenseFormValues } from "@/lib/validations";
import { expenseSchema } from "@/lib/validations";

export type Category = { id: string; name: string; color: string; icon: string; createdAt: Date };
export type ExpenseGroup = { id: string; name: string; description: string | null; createdAt: Date };
export type Expense = { id: string; title: string; amount: number; date: Date; categoryId: string; category: Category; groupId: string | null; group: ExpenseGroup | null; notes: string | null; createdAt: Date };

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

export default function ExpenseClient() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: () => api.get("/expenses").then((res: any) => res.data),
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res: any) => res.data),
  });

  const { data: groups = [] } = useQuery<ExpenseGroup[]>({
    queryKey: ["groups"],
    queryFn: () => api.get("/groups").then((res: any) => res.data),
  });

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
      groupId: "",
      notes: ""
    }
  });

  const openAdd = () => {
    reset({
      title: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
      groupId: "",
      notes: ""
    });
    setIsAddOpen(true);
  };

  const openEdit = (e: Expense) => {
    reset({
      title: e.title,
      amount: e.amount,
      date: new Date(e.date).toISOString().split("T")[0],
      categoryId: e.categoryId,
      groupId: e.groupId ?? "",
      notes: e.notes ?? ""
    });
    setEditTarget(e);
  };

  const closeAll = () => {
    setIsAddOpen(false);
    setEditTarget(null);
  };

  const createMutation = useMutation({
    mutationFn: (data: ExpenseFormValues) => api.post("/expenses", { ...data, date: new Date(data.date).toISOString() }).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense added!");
      closeAll();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExpenseFormValues }) => api.put(`/expenses/${id}`, { ...data, date: new Date(data.date).toISOString() }).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense updated!");
      closeAll();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update expense");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/expenses/${id}`).then((res: any) => res.data),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense deleted.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    },
    onSettled: () => setDeletingId(null),
  });

  const onSubmit = (data: any) => {
    // Convert empty groupId to null
    if (!data.groupId) data.groupId = null;
    
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} placeholder="e.g. Groceries" className={errors.title ? "border-red-500" : ""} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="amount" type="number" step="0.01" min="0" {...register("amount")} placeholder="0.00" className={`pl-9 ${errors.amount ? "border-red-500" : ""}`} />
          </div>
          {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register("date")} className={errors.date ? "border-red-500" : ""} />
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Label htmlFor="categoryId">Category</Label>
        <select id="categoryId" {...register("categoryId")} className={`flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.categoryId ? "border-red-500" : "border-input"}`}>
          <option value="" disabled>Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="groupId">Group (optional)</Label>
        <select id="groupId" {...register("groupId")} className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
          <option value="">None</option>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} placeholder="Optional details..." rows={2} />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-2">
        <Button type="button" variant="ghost" onClick={closeAll}>Cancel</Button>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : (editTarget ? "Save Changes" : "Add Expense")}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground text-sm mt-1">{expenses.length} total · Showing {filtered.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3 flex-wrap items-center bg-white dark:bg-card border-border/50">
        <div className="relative flex-1 min-w-[200px] w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-44 flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Input type="date" className="w-full sm:w-40" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
        <Input type="date" className="w-full sm:w-40" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
        {(search || filterCat !== "all" || filterFrom || filterTo) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setFilterCat("all"); setFilterFrom(""); setFilterTo(""); }}>
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </Card>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
          <p className="text-sm font-semibold">
            Total: <span className="text-primary">${totalFiltered.toFixed(2)}</span>
          </p>
        </div>
      )}

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] border-dashed border-border bg-transparent shadow-none">
          <Receipt className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No expenses found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            {expenses.length === 0 ? "Add your first expense to get started." : "Try adjusting your filters."}
          </p>
          {expenses.length === 0 && (
            <Button onClick={openAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-x-auto border-border/50 bg-white dark:bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Group</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((exp) => (
                <TableRow key={exp.id} className="group hover:bg-surface-hover">
                  <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                    {new Date(exp.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{exp.title}</p>
                      {exp.notes && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{exp.notes}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="outline" style={{ backgroundColor: `${exp.category.color}15`, color: exp.category.color, borderColor: `${exp.category.color}30` }}>
                      {exp.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {exp.group ? (
                      <span className="text-xs font-medium text-muted-foreground border border-border rounded-md px-2 py-0.5 bg-muted/30">
                        {exp.group.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap font-bold text-foreground">
                    ${exp.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(exp)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        disabled={deletingId === exp.id}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        {deletingId === exp.id
                          ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          {formBody}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && closeAll()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {formBody}
        </DialogContent>
      </Dialog>
    </div>
  );
}
