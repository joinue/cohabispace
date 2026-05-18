import { FamilyTaskRow } from "@/features/tasks/components/family-task-row";
import { groupTasksByDue } from "@/features/tasks/utils";
import type { TaskWithSubtasks } from "@/features/tasks/queries";

/**
 * Ambient task list for mounted-tablet Family Display. Shows only what
 * matters at-a-glance: overdue (red), today (the focus), tomorrow (preview).
 * Tasks further out are intentionally hidden — toggle Family Display off
 * to plan ahead.
 */
export function FamilyTaskList({ tasks }: { tasks: TaskWithSubtasks[] }) {
  const groups = groupTasksByDue(tasks);
  const overdue = groups.overdue;
  const today = groups.today;
  const tomorrow = groups.tomorrow;

  const anyToday = overdue.length + today.length > 0;
  const anyTomorrow = tomorrow.length > 0;

  if (!anyToday && !anyTomorrow) {
    return (
      <div className="border-border bg-muted/20 rounded-2xl border border-dashed px-6 py-16 text-center">
        <p className="text-foreground text-2xl font-medium">All done.</p>
        <p className="text-muted-foreground mt-2 text-base">Nothing on the list today.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {overdue.length > 0 ? <Section label="Overdue" tone="destructive" tasks={overdue} /> : null}
      {today.length > 0 ? <Section label="Today" tasks={today} /> : null}
      {anyTomorrow ? <Section label="Tomorrow" tasks={tomorrow} tone="muted" /> : null}
    </div>
  );
}

function Section({
  label,
  tasks,
  tone = "default",
}: {
  label: string;
  tasks: TaskWithSubtasks[];
  tone?: "default" | "muted" | "destructive";
}) {
  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-baseline justify-between px-3">
        <h2
          className={
            tone === "destructive"
              ? "text-destructive text-sm font-semibold tracking-wide uppercase"
              : tone === "muted"
                ? "text-muted-foreground text-sm font-semibold tracking-wide uppercase"
                : "text-foreground text-sm font-semibold tracking-wide uppercase"
          }
        >
          {label}
        </h2>
        <span className="text-muted-foreground text-sm tabular-nums">{tasks.length}</span>
      </header>
      <ul className="flex flex-col gap-0.5">
        {tasks.map((t) => (
          <FamilyTaskRow key={t.id} task={t} />
        ))}
      </ul>
    </section>
  );
}
