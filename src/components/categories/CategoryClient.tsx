"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { createCategory, deleteCategory } from "@/actions/categoryActions";

export default function CategoryClient({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#a855f7"); // default modern purple

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    await createCategory({ name, color, icon: "tag" });
    setIsSubmitting(false);
    setIsOpen(false);
    setName(""); setColor("#a855f7");
  };

  const handleDelete = async (id: string) => {
    if(confirm("Delete category? This will fail if there are expenses linked to it.")) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-full font-medium transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-surface rounded-2xl ring-1 ring-border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-hover/50 text-xs uppercase tracking-wider text-foreground/60">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Color</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-foreground/50">
                  No categories found.
                </td>
              </tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-surface-hover/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-foreground">{cat.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md shadow-sm ring-1 ring-black/5" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-foreground/60 uppercase font-mono">{cat.color}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm fade-in">
          <div className="bg-surface w-full max-w-sm rounded-3xl ring-1 ring-border shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-hover/30">
              <h2 className="text-xl font-bold tracking-tight">Add Category</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-surface-hover rounded-full transition-colors text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="E.g., Utilities"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Color Theme</label>
                <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                  <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent p-0"
                  />
                  <span className="text-sm font-mono text-foreground/60 uppercase">{color}</span>
                </div>
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
                  className="px-5 py-2.5 rounded-full font-medium text-sm bg-primary hover:bg-primary-hover text-white transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
