import { format, isThisYear, isToday, isYesterday, parseISO } from "date-fns";

import { TaskRow } from "@/features/tasks/components/task-row";
import type { HouseholdMember } from "@/features/households/queries";
import type { SpaceRow } from "@/features/spaces/queries";
import type { TaskWithRelations } from "@/features/tasks/queries";

function dayKey(iso: string): string {
  const d = parseISO(iso);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  if (isThisYear(d)) return format(d, "EEE, MMM d");
  return format(d, "MMM d, yyyy");
}

export function CompletedList({
  tasks,
  members,
  spaces,
}: {
  tasks: TaskWithRelations[];
  members: HouseholdMember[];
  spaces: SpaceRow[];
}) {
  if (tasks.length === 0) {
    return (
      <div className="border-border bg-muted/20 text-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm">
        Nothing completed yet. Get to it.
      </div>
    );
  }

  // Group by completion-date label, preserving the input order (already
  // descending by completed_at).
  const groups: Array<{ label: string; items: TaskWithRelations[] }> = [];
  for (const t of tasks) {
    const label = t.completed_at ? dayKey(t.completed_at) : "Unknown";
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(t);
    else groups.push({ label, items: [t] });
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <section key={g.label} className="flex flex-col gap-1.5">
          <header className="flex items-center justify-between px-2">
            <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {g.label}
            </h2>
            <span className="text-muted-foreground text-xs tabular-nums">{g.items.length}</span>
          </header>
          <ul className="flex flex-col">
            {g.items.map((t) => (
              <TaskRow key={t.id} task={t} members={members} spaces={spaces} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
