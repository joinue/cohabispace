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
import { getPendingTasks } from "@/features/tasks/queries";

export const metadata: Metadata = { title: "Space" };

export default async function SpacePage({ params }: { params: Promise<{ spaceId: string }> }) {
  const { spaceId } = await params;
  const households = await getMyHouseholds();
  if (households.length === 0) notFound();

  const active = await getActiveHousehold();
  if (!active) notFound();

  const allSpaces = await getActiveSpaces(active.id);
  const space = allSpaces.find((s) => s.id === spaceId);
  if (!space) notFound();

  const [tasks, members] = await Promise.all([
    getPendingTasks(active.id, { spaceId: space.id }),
    getHouseholdMembers(active.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <SpaceMark space={space} size="lg" />
        <div className="flex flex-col gap-0.5">
          <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
            Space
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
        emptyMessage={`No tasks in ${space.name} yet. Add one above.`}
      />
    </div>
  );
}
