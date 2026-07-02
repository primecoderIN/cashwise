"use client";

import { useState } from "react";
import { Plus, Trash2, Tags } from "lucide-react";
import { createCategory, deleteCategory } from "@/actions/categoryActions";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import type { Category } from "@/types";

const PRESET_COLORS = [
  "#7c3aed", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#3b82f6", "#f97316",
];

export default function CategoryClient({ categories }: { categories: Category[] }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen]         = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [name, setName]             = useState("");
  const [color, setColor]           = useState(PRESET_COLORS[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    const res = await createCategory({ name: name.trim(), color, icon: "tag" });
    toast(res.success ? "Category created!" : (res.error ?? "Failed"), res.success ? "success" : "error");
    setIsSubmitting(false);
    if (res.success) { setIsOpen(false); setName(""); setColor(PRESET_COLORS[0]); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteCategory(id);
    toast(res.success ? "Category deleted." : (res.error ?? "Cannot delete — expenses are linked to it."), res.success ? "info" : "error");
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Card Grid */}
      {categories.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Tags}
            title="No categories yet"
            description="Create your first category to start organizing expenses."
            action={<Button onClick={() => setIsOpen(true)}><Plus className="w-4 h-4" />Add Category</Button>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {categories.map((cat) => (
            <div key={cat.id} className="card fade-in p-5 flex items-center gap-4 group">
              {/* Color swatch */}
              <div
                className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: cat.color }} />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{cat.name}</p>
                <p className="text-xs font-mono text-muted uppercase mt-0.5">{cat.color}</p>
              </div>
              {/* Delete */}
              <button
                onClick={() => handleDelete(cat.id)}
                disabled={deletingId === cat.id}
                className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-40"
                title="Delete category"
              >
                {deletingId === cat.id
                  ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                  : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Category" maxWidth="max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Utilities"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground/80">Color</label>
            {/* Preset palette */}
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 ring-offset-2 ring-offset-surface"
                  style={{
                    backgroundColor: c,
                    boxShadow: color === c ? `0 0 0 3px ${c}` : undefined,
                    outline: color === c ? "2px solid white" : undefined,
                    outlineOffset: color === c ? "2px" : undefined,
                  }}
                />
              ))}
            </div>
            {/* Custom picker */}
            <div className="flex items-center gap-3 input-base p-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-md cursor-pointer border-none bg-transparent p-0 shrink-0"
              />
              <span className="text-sm font-mono text-muted uppercase">{color}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
