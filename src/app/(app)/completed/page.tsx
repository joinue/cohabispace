import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";

import {
  getActiveHousehold,
  getHouseholdMembers,
  getMyHouseholds,
} from "@/features/households/queries";
import { getActiveSpaces } from "@/features/spaces/queries";
import { CompletedList } from "@/features/tasks/components/completed-list";
import { getCompletedTasks } from "@/features/tasks/queries";

export const metadata: Metadata = { title: "Completed" };

export default async function CompletedPage() {
  const households = await getMyHouseholds();
  if (households.length === 0) redirect("/households/new" as Route);

  const active = await getActiveHousehold();
  if (!active) redirect("/households/new" as Route);

  const [tasks, members, spaces] = await Promise.all([
    getCompletedTasks(active.id, 100),
    getHouseholdMembers(active.id),
    getActiveSpaces(active.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
          Done
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Completed</h1>
        <p className="text-muted-foreground text-sm">
          The last 100 tasks anyone in {active.name} marked done. Click the checkbox to restore.
        </p>
      </div>

      <CompletedList tasks={tasks} members={members} spaces={spaces} />
    </div>
  );
}
