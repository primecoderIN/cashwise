import { getGroups } from "@/actions/groupActions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GroupClient from "@/components/groups/GroupClient";

export default async function GroupsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const groups = await getGroups();

  return (
    <div className="flex flex-col gap-6 fade-in">
      <h1 className="text-3xl font-bold">Expense Groups</h1>
      <GroupClient groups={groups} />
    </div>
  );
}
