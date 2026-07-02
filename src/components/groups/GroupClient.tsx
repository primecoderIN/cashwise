"use client";

import { useState } from "react";
import { Plus, Trash2, FolderGit2 } from "lucide-react";
import { createGroup, deleteGroup } from "@/actions/groupActions";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input, { TextArea } from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import type { ExpenseGroup } from "@/types";

const GROUP_COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

export default function GroupClient({ groups }: { groups: ExpenseGroup[] }) {
  const { toast } = useToast();
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
    toast(res.success ? "Group created!" : (res.error ?? "Failed"), res.success ? "success" : "error");
    setIsSubmitting(false);
    if (res.success) { setIsOpen(false); setName(""); setDescription(""); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteGroup(id);
    toast(res.success ? "Group deleted." : (res.error ?? "Cannot delete — expenses are linked to it."), res.success ? "info" : "error");
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
          <p className="text-muted text-sm mt-1">Organise expenses into trips, projects, or periods</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Group
        </Button>
      </div>

      {/* Card Grid */}
      {groups.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FolderGit2}
            title="No groups yet"
            description="Groups let you bundle expenses — perfect for trips, events, or projects."
            action={<Button onClick={() => setIsOpen(true)}><Plus className="w-4 h-4" />Add Group</Button>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {groups.map((group) => {
            const color = colorForGroup(group.name);
            return (
              <div key={group.id} className="card fade-in p-5 flex items-start gap-4 group/card">
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
                    <p className="text-xs text-muted mt-1 line-clamp-2">{group.description}</p>
                  ) : (
                    <p className="text-xs text-muted/50 mt-1 italic">No description</p>
                  )}
                  <p className="text-xs text-muted mt-2">
                    Created {new Date(group.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                {/* Delete */}
                <button
                  onClick={() => handleDelete(group.id)}
                  disabled={deletingId === group.id}
                  className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover/card:opacity-100 shrink-0 disabled:opacity-40"
                  title="Delete group"
                >
                  {deletingId === group.id
                    ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                    : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Group" maxWidth="max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Trip to Paris"
          />
          <TextArea
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this group for?"
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
