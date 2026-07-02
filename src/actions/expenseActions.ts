"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: {
      category: true,
      group: true,
    },
    orderBy: { date: "desc" },
  });
  return expenses;
}

export async function addExpense(data: {
  title: string;
  amount: number;
  date: Date;
  categoryId: string;
  groupId?: string;
  notes?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const expense = await prisma.expense.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath("/expenses");
    revalidatePath("/");
    return { success: true, expense };
  } catch (error) {
    console.error("Failed to add expense", error);
    return { success: false, error: "Failed to add expense." };
  }
}

export async function updateExpense(
  expenseId: string,
  data: {
    title?: string;
    amount?: number;
    date?: Date;
    categoryId?: string;
    groupId?: string | null;
    notes?: string | null;
  }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const expense = await prisma.expense.update({
      where: { id: expenseId, userId },
      data,
    });
    revalidatePath("/expenses");
    revalidatePath("/");
    return { success: true, expense };
  } catch (error) {
    console.error("Failed to update expense", error);
    return { success: false, error: "Failed to update expense." };
  }
}

export async function deleteExpense(expenseId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await prisma.expense.delete({
      where: {
        id: expenseId,
        userId,
      },
    });
    revalidatePath("/expenses");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete expense", error);
    return { success: false, error: "Failed to delete expense." };
  }
}
