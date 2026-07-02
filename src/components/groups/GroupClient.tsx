"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { createGroup, deleteGroup } from "@/actions/groupActions";

export default function GroupClient({ groups }: { groups: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    await createGroup({ name, description });
    setIsSubmitting(false);
    setIsOpen(false);
    setName(""); setDescription("");
  };

  const handleDelete = async (id: string) => {
    if(confirm("Delete group? This will fail if there are expenses linked to it.")) {
      await deleteGroup(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Expense Groups</h1>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-full font-medium transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          Add Group
        </button>
      </div>

      <div className="bg-surface rounded-2xl ring-1 ring-border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-hover/50 text-xs uppercase tracking-wider text-foreground/60">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {groups.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-foreground/50">
                  No groups found.
                </td>
              </tr>
            ) : groups.map((group) => (
              <tr key={group.id} className="hover:bg-surface-hover/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-foreground">{group.name}</span>
                </td>
                <td className="px-6 py-4 text-foreground/70 text-sm">
                  {group.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button 
                    onClick={() => handleDelete(group.id)}
                    className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Group"
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
              <h2 className="text-xl font-bold tracking-tight">Add Group</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-surface-hover rounded-full transition-colors text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Group Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="E.g., Trip to Paris"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details..."
                  rows={3}
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
                  className="px-5 py-2.5 rounded-full font-medium text-sm bg-primary hover:bg-primary-hover text-white transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
