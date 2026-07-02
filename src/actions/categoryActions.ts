"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return categories;
}

export async function createCategory(data: { name: string; color: string; icon: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const category = await prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath("/categories");
    revalidatePath("/expenses");
    return { success: true, category };
  } catch (error) {
    console.error("Failed to create category", error);
    return { success: false, error: "Failed to create category. It might already exist." };
  }
}

export async function deleteCategory(categoryId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
        userId,
      },
    });
    revalidatePath("/categories");
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category", error);
    return { success: false, error: "Failed to delete category." };
  }
}
