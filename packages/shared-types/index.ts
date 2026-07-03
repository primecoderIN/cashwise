// Shared TypeScript types derived from Prisma schema

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseGroup = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: Date;
  notes: string | null;
  categoryId: string;
  groupId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  group: ExpenseGroup | null;
};

export type ExpenseFormData = {
  title: string;
  amount: number;
  date: Date;
  categoryId: string;
  groupId?: string;
  notes?: string;
};
