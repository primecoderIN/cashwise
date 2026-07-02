import { getCategories } from "@/actions/categoryActions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CategoryClient from "@/components/categories/CategoryClient";

export default async function CategoriesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const categories = await getCategories();

  return <CategoryClient categories={categories} />;
}
