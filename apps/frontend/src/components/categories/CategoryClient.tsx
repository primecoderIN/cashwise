"use client";

import { useState } from "react";
import { Plus, Trash2, Tags } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { CategoryFormValues } from "@/lib/validations";
import { categorySchema } from "@/lib/validations";
import { IconPicker, getIconComponent, ICONS } from "@/components/common/IconPicker";
import { ColorPicker, COLORS } from "@/components/common/ColorPicker";
import { Textarea } from "@/components/ui/textarea";

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
};

export default function CategoryClient() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res: any) => res.data),
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: ICONS[1].value, // Tags
      color: COLORS[0],
      description: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormValues) => api.post("/categories", data).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created!");
      setIsOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`).then((res: any) => res.data),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cannot delete — expenses are linked to it.");
    },
    onSettled: () => setDeletingId(null),
  });

  const onSubmit = (data: CategoryFormValues) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Organize your expenses into meaningful categories</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : categories.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] border-dashed border-border bg-transparent shadow-none">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Tags className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No categories yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Create categories to classify your spending and get better insights.
          </p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {categories.map((category) => {
            const Icon = getIconComponent(category.icon);
            return (
              <Card key={category.id} className="p-5 flex items-center gap-4 group hover:shadow-md transition-all border-border/50 bg-white dark:bg-card">
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate text-lg">{category.name}</p>
                </div>
                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={deletingId === category.id}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-40"
                  title="Delete category"
                >
                  {deletingId === category.id
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
            <DialogTitle>New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g. Food & Dining"
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
                placeholder="What is this category for?"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
