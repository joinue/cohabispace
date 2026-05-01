import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getActiveHousehold,
  getHouseholdMembers,
  getMyHouseholds,
} from "@/features/households/queries";
import { getActiveSpaces } from "@/features/spaces/queries";
import { SPACE_COLOR_TOKENS } from "@/features/spaces/colors";
import { QuickAddTask } from "@/features/tasks/components/quick-add-task";
import { TaskList } from "@/features/tasks/components/task-list";
import { getPendingTasks } from "@/features/tasks/queries";
import { cn } from "@/lib/utils";

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

  const tokens = SPACE_COLOR_TOKENS[space.color];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div
          className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-2xl", tokens.bg)}
          aria-hidden="true"
        >
          {space.icon ?? "•"}
        </div>
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
