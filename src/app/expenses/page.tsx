import { getExpenses } from "@/actions/expenseActions";
import { getCategories } from "@/actions/categoryActions";
import { getGroups } from "@/actions/groupActions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ExpenseClient from "@/components/expenses/ExpenseClient";

export default async function ExpensesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const [expenses, categories, groups] = await Promise.all([
    getExpenses(),
    getCategories(),
    getGroups(),
  ]);

  return (
    <div className="flex flex-col gap-6 fade-in">
      <h1 className="text-3xl font-bold">Expenses</h1>
      <ExpenseClient expenses={expenses} categories={categories} groups={groups} />
    </div>
  );
}
