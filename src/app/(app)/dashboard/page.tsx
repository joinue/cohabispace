import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UsersIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  getActiveHousehold,
  getHouseholdMembers,
  getMyHouseholds,
} from "@/features/households/queries";
import { QuickAddTask } from "@/features/tasks/components/quick-add-task";
import { TaskList } from "@/features/tasks/components/task-list";
import { getPendingTasks } from "@/features/tasks/queries";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const households = await getMyHouseholds();
  if (households.length === 0) {
    redirect("/households/new" as Route);
  }

  const active = await getActiveHousehold();
  if (!active) redirect("/households/new" as Route);

  const [tasks, members] = await Promise.all([
    getPendingTasks(active.id),
    getHouseholdMembers(active.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{active.name}</h1>
        </div>
        <Link
          href={`/households/${active.id}/members` as Route}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <UsersIcon aria-hidden="true" />
          Members
        </Link>
      </div>

      <QuickAddTask householdId={active.id} members={members} />

      <TaskList tasks={tasks} members={members} />
    </div>
  );
}
