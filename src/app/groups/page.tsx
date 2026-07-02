import { getGroups } from "@/actions/groupActions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GroupClient from "@/components/groups/GroupClient";

export default async function GroupsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const groups = await getGroups();

  return <GroupClient groups={groups} />;
}
