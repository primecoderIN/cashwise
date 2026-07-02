"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getGroups() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const groups = await prisma.expenseGroup.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return groups;
}

export async function createGroup(data: { name: string; description?: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const group = await prisma.expenseGroup.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath("/groups");
    revalidatePath("/expenses");
    return { success: true, group };
  } catch (error) {
    console.error("Failed to create group", error);
    return { success: false, error: "Failed to create group. It might already exist." };
  }
}

export async function deleteGroup(groupId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await prisma.expenseGroup.delete({
      where: {
        id: groupId,
        userId,
      },
    });
    revalidatePath("/groups");
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete group", error);
    return { success: false, error: "Failed to delete group." };
  }
}
