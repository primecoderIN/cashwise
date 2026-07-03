"use client";

import { useState } from "react";
import { Plus, Trash2, FolderGit2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GroupFormValues } from "@/lib/validations";
import { groupSchema } from "@/lib/validations";
import { IconPicker, getIconComponent, ICONS } from "@/components/common/IconPicker";
import { ColorPicker, COLORS } from "@/components/common/ColorPicker";

export type ExpenseGroup = { id: string; name: string; description: string | null; icon: string; color: string; createdAt: Date };

export default function GroupClient() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: groups = [], isLoading } = useQuery<ExpenseGroup[]>({
    queryKey: ["groups"],
    queryFn: () => api.get("/groups").then((res: any) => res.data),
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: ICONS[0].value,
      color: COLORS[0],
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: GroupFormValues) => api.post("/groups", data).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created!");
      setIsOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/groups/${id}`).then((res: any) => res.data),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group deleted.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cannot delete — expenses are linked to it.");
    },
    onSettled: () => setDeletingId(null),
  });

  const onSubmit = (data: GroupFormValues) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expense Groups</h1>
          <p className="text-muted-foreground text-sm mt-1">Organise expenses into trips, projects, or periods</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : groups.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] border-dashed border-border bg-transparent shadow-none">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <FolderGit2 className="w-8 h-8" />
          </div>
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
            const Icon = getIconComponent(group.icon);
            return (
              <Card key={group.id} className="p-5 flex items-start gap-4 group hover:shadow-md transition-all border-border/50 bg-white dark:bg-card">
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${group.color}20`, color: group.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate text-lg">{group.name}</p>
                  {group.description ? (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{group.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground/50 mt-1 italic">No description</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(group.id)}
                  disabled={deletingId === group.id}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-40"
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g. Trip to Paris"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-3">
              <Label>Icon</Label>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <IconPicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Color</Label>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <ColorPicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="What is this group for?"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
