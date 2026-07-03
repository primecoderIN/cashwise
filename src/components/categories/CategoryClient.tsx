"use client";

import { useState } from "react";
import { Plus, Trash2, Tags } from "lucide-react";
import { createCategory, deleteCategory } from "@/actions/categoryActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types";

const PRESET_COLORS = [
  "#7c3aed", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#3b82f6", "#f97316",
];

export default function CategoryClient({ categories }: { categories: Category[] }) {
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
    
    if (res.success) {
      toast.success("Category created!");
      setIsOpen(false); 
      setName(""); 
      setColor(PRESET_COLORS[0]);
    } else {
      toast.error(res.error ?? "Failed to create category");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteCategory(id);
    if (res.success) {
      toast.success("Category deleted.");
    } else {
      toast.error(res.error ?? "Cannot delete — expenses are linked to it.");
    }
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Card Grid */}
      {categories.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
          <Tags className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No categories yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Create your first category to start organizing expenses.
          </p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {categories.map((cat) => (
            <Card key={cat.id} className="p-5 flex items-center gap-4 group hover:shadow-md transition-shadow">
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
                <p className="text-xs font-mono text-muted-foreground uppercase mt-0.5">{cat.color}</p>
              </div>
              {/* Delete */}
              <button
                onClick={() => handleDelete(cat.id)}
                disabled={deletingId === cat.id}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-40"
                title="Delete category"
              >
                {deletingId === cat.id
                  ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                  : <Trash2 className="w-4 h-4" />}
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Utilities"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Color</Label>
              {/* Preset palette */}
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-8 h-8 rounded-full transition-transform hover:scale-110 ring-offset-2 ring-offset-background"
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
              <div className="flex items-center gap-3 border border-input rounded-md px-3 py-2 bg-background">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-md cursor-pointer border-none bg-transparent p-0 shrink-0"
                />
                <span className="text-sm font-mono text-muted-foreground uppercase">{color}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

