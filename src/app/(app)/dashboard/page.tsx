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
import { getActiveSpaces } from "@/features/spaces/queries";
import { QuickAddTask } from "@/features/tasks/components/quick-add-task";
import { TaskList } from "@/features/tasks/components/task-list";
import { getPendingTasks, withSubtasks } from "@/features/tasks/queries";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  const households = await getMyHouseholds();
  if (households.length === 0) {
    redirect("/households/new" as Route);
  }

  const active = await getActiveHousehold();
  if (!active) redirect("/households/new" as Route);

  const [topLevel, members, spaces] = await Promise.all([
    getPendingTasks(active.id, { tag: tag ?? null }),
    getHouseholdMembers(active.id),
    getActiveSpaces(active.id),
  ]);
  const tasks = await withSubtasks(topLevel);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
            {tag ? `Tagged #${tag}` : "All tasks"}
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

      <QuickAddTask householdId={active.id} members={members} spaces={spaces} />

      <TaskList
        tasks={tasks}
        members={members}
        spaces={spaces}
        emptyMessage={
          tag ? `No tasks tagged #${tag}.` : "No tasks yet. Add one above to get started."
        }
      />
    </div>
  );
}
