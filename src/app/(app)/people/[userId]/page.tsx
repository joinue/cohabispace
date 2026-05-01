import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getActiveHousehold,
  getHouseholdMembers,
  getMyHouseholds,
} from "@/features/households/queries";
import { getActiveSpaces } from "@/features/spaces/queries";
import { QuickAddTask } from "@/features/tasks/components/quick-add-task";
import { TaskList } from "@/features/tasks/components/task-list";
import { getPendingTasks, withSubtasks } from "@/features/tasks/queries";

export const metadata: Metadata = { title: "Person" };

function initials(name: string | null, email: string): string {
  const source = (name?.trim() || email).trim();
  if (!source) return "?";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .toUpperCase();
}

export default async function PersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const [{ userId }, { tag }] = await Promise.all([params, searchParams]);

  const households = await getMyHouseholds();
  if (households.length === 0) notFound();

  const active = await getActiveHousehold();
  if (!active) notFound();

  const members = await getHouseholdMembers(active.id);
  const member = members.find((m) => m.userId === userId);
  if (!member) notFound();

  const [topLevel, spaces] = await Promise.all([
    getPendingTasks(active.id, { assigneeId: userId, tag: tag ?? null }),
    getActiveSpaces(active.id),
  ]);
  const tasks = await withSubtasks(topLevel);

  const name = member.displayName ?? member.email.split("@")[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          {member.avatarUrl ? (
            <AvatarImage src={member.avatarUrl} alt="" />
          ) : (
            <AvatarFallback className="text-base">
              {initials(member.displayName, member.email)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
            {tag ? `Person · #${tag}` : "Person"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
          <p className="text-muted-foreground text-xs capitalize">{member.role}</p>
        </div>
      </div>

      <QuickAddTask householdId={active.id} members={members} spaces={spaces} />

      <TaskList
        tasks={tasks}
        members={members}
        spaces={spaces}
        emptyMessage={
          tag
            ? `No tasks assigned to ${name} tagged #${tag}.`
            : `No pending tasks assigned to ${name}.`
        }
      />
    </div>
  );
}
