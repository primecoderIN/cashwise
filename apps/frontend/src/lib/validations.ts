import { z } from "zod";

export const groupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(50),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
  description: z.string().optional(),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
  groupId: z.string().nullable().optional(),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
  description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const expenseSchema = z.object({
  title: z.string().min(1, "Expense title is required").max(100),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  groupId: z.string().nullable().optional(),
  categoryId: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
