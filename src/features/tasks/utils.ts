import {
  differenceInCalendarDays,
  format,
  isThisWeek,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
} from "date-fns";

export type DueGroup = "overdue" | "today" | "tomorrow" | "thisWeek" | "later" | "noDate";

export interface DueGroupMeta {
  key: DueGroup;
  label: string;
}

export const DUE_GROUP_ORDER: DueGroupMeta[] = [
  { key: "overdue", label: "Overdue" },
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "thisWeek", label: "This week" },
  { key: "later", label: "Later" },
  { key: "noDate", label: "No date" },
];

export function classifyDue(dueAt: string | null): DueGroup {
  if (!dueAt) return "noDate";
  const d = parseISO(dueAt);
  const now = new Date();
  if (d.getTime() < now.getTime() - 24 * 60 * 60 * 1000 && !isToday(d)) {
    // Hard overdue: due more than 24h ago and not "today" (some tasks
    // have a midnight due time that crosses naturally into the next day).
  }
  if (d < now && !isToday(d)) return "overdue";
  if (isToday(d)) return "today";
  if (isTomorrow(d)) return "tomorrow";
  if (isThisWeek(d, { weekStartsOn: 1 })) return "thisWeek";
  return "later";
}

/**
 * Friendly relative label for a due date — "Today", "Tomorrow", "Sat",
 * "Mar 14". Past dates show the weekday or a date.
 */
export function formatDueDate(dueAt: string | null): string | null {
  if (!dueAt) return null;
  const d = parseISO(dueAt);
  const now = new Date();
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isYesterday(d)) return "Yesterday";

  const days = differenceInCalendarDays(d, now);
  if (days > 1 && days < 7) return format(d, "EEE");
  if (days < 0 && days > -7) return format(d, "EEE");
  // Same calendar year: "Mar 14"; otherwise include the year.
  if (d.getFullYear() === now.getFullYear()) return format(d, "MMM d");
  return format(d, "MMM d, yyyy");
}

export function groupTasksByDue<T extends { due_at: string | null }>(
  tasks: T[],
): Record<DueGroup, T[]> {
  const groups: Record<DueGroup, T[]> = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    noDate: [],
  };
  for (const t of tasks) groups[classifyDue(t.due_at)].push(t);
  return groups;
}
