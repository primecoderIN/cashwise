"use client";

import { useState } from "react";
import { Plus, Trash2, FolderGit2 } from "lucide-react";
import { createGroup, deleteGroup } from "@/actions/groupActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { ExpenseGroup } from "@/types";

const GROUP_COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

export default function GroupClient({ groups }: { groups: ExpenseGroup[] }) {
  const [isOpen, setIsOpen]             = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [name, setName]                 = useState("");
  const [description, setDescription]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    const res = await createGroup({ name: name.trim(), description: description.trim() });
    
    if (res.success) {
      toast.success("Group created!");
      setIsOpen(false); 
      setName(""); 
      setDescription("");
    } else {
      toast.error(res.error ?? "Failed to create group");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteGroup(id);
    if (res.success) {
      toast.success("Group deleted.");
    } else {
      toast.error(res.error ?? "Cannot delete — expenses are linked to it.");
    }
    setDeletingId(null);
  };

  // Generate a stable color from group name
  const colorForGroup = (name: string) =>
    GROUP_COLORS[name.charCodeAt(0) % GROUP_COLORS.length];

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Groups</h1>
          <p className="text-muted-foreground text-sm mt-1">Organise expenses into trips, projects, or periods</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>

      {/* Card Grid */}
      {groups.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
          <FolderGit2 className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No groups yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Groups let you bundle expenses — perfect for trips, events, or projects.
          </p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Group
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {groups.map((group) => {
            const color = colorForGroup(group.name);
            return (
              <Card key={group.id} className="p-5 flex items-start gap-4 group hover:shadow-md transition-shadow">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <FolderGit2 className="w-5 h-5" style={{ color }} />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{group.name}</p>
                  {group.description ? (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{group.description}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground/50 mt-1 italic">No description</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {new Date(group.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                {/* Delete */}
                <button
                  onClick={() => handleDelete(group.id)}
                  disabled={deletingId === group.id}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-40"
                  title="Delete group"
                >
                  {deletingId === group.id
                    ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                    : <Trash2 className="w-4 h-4" />}
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Trip to Paris"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this group for?"
                rows={3}
              />
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
