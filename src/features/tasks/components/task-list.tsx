import { TaskRow } from "@/features/tasks/components/task-row";
import { DUE_GROUP_ORDER, type DueGroup, groupTasksByDue } from "@/features/tasks/utils";
import type { TaskWithAssignee } from "@/features/tasks/queries";

export function TaskList({ tasks }: { tasks: TaskWithAssignee[] }) {
  const groups = groupTasksByDue(tasks);
  const visible = DUE_GROUP_ORDER.filter((g) => groups[g.key].length > 0);

  if (visible.length === 0) {
    return (
      <div className="border-border bg-muted/20 text-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm">
        No tasks yet. Add one above to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {visible.map((group) => (
        <Section
          key={group.key}
          groupKey={group.key}
          label={group.label}
          tasks={groups[group.key]}
        />
      ))}
    </div>
  );
}

function Section({
  groupKey,
  label,
  tasks,
}: {
  groupKey: DueGroup;
  label: string;
  tasks: TaskWithAssignee[];
}) {
  return (
    <section className="flex flex-col gap-1.5">
      <header className="flex items-center justify-between px-2">
        <h2
          className={
            groupKey === "overdue"
              ? "text-destructive text-xs font-medium tracking-wide uppercase"
              : "text-muted-foreground text-xs font-medium tracking-wide uppercase"
          }
        >
          {label}
        </h2>
        <span className="text-muted-foreground text-xs tabular-nums">{tasks.length}</span>
      </header>
      <ul className="flex flex-col">
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} />
        ))}
      </ul>
    </section>
  );
}
