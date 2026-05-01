import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getActiveHousehold,
  getHouseholdMembers,
  getMyHouseholds,
} from "@/features/households/queries";
import { getActiveSpaces } from "@/features/spaces/queries";
import { SpaceMark } from "@/features/spaces/components/space-mark";
import { QuickAddTask } from "@/features/tasks/components/quick-add-task";
import { TaskList } from "@/features/tasks/components/task-list";
import { getPendingTasks, withSubtasks } from "@/features/tasks/queries";

export const metadata: Metadata = { title: "Space" };

export default async function SpacePage({
  params,
  searchParams,
}: {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const [{ spaceId }, { tag }] = await Promise.all([params, searchParams]);

  const households = await getMyHouseholds();
  if (households.length === 0) notFound();

  const active = await getActiveHousehold();
  if (!active) notFound();

  const allSpaces = await getActiveSpaces(active.id);
  const space = allSpaces.find((s) => s.id === spaceId);
  if (!space) notFound();

  const [topLevel, members] = await Promise.all([
    getPendingTasks(active.id, { spaceId: space.id, tag: tag ?? null }),
    getHouseholdMembers(active.id),
  ]);
  const tasks = await withSubtasks(topLevel);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <SpaceMark space={space} size="lg" />
        <div className="flex flex-col gap-0.5">
          <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
            {tag ? `Space · #${tag}` : "Space"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{space.name}</h1>
        </div>
      </div>

      <QuickAddTask
        householdId={active.id}
        members={members}
        spaces={allSpaces}
        defaultSpaceId={space.id}
      />

      <TaskList
        tasks={tasks}
        members={members}
        spaces={allSpaces}
        showSpacePill={false}
        emptyMessage={
          tag
            ? `No tasks in ${space.name} tagged #${tag}.`
            : `No tasks in ${space.name} yet. Add one above.`
        }
      />
    </div>
  );
}
