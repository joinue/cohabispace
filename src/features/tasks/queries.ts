import "server-only";

import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { throwQueryError } from "@/lib/supabase/errors";
import { requireUser } from "@/lib/dal";
import type { Database, SpaceColor, TaskStatus } from "@/lib/supabase/database.types";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

export interface TaskWithRelations extends TaskRow {
  assignee: {
    id: string;
    display_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
  space: {
    id: string;
    name: string;
    icon: string | null;
    color: SpaceColor;
  } | null;
}

export interface TaskWithSubtasks extends TaskWithRelations {
  subtasks: TaskWithRelations[];
}

/** @deprecated alias kept for callers — prefer `TaskWithRelations`. */
export type TaskWithAssignee = TaskWithRelations;

const TASK_SELECT =
  "id, household_id, parent_task_id, series_id, title, notes, status, due_at, completed_at, completed_by, assigned_to, created_by, rrule, tags, position, space_id, created_at, updated_at, assignee:profiles!tasks_assigned_to_fkey(id, display_name, email, avatar_url), space:spaces(id, name, icon, color)";

export const getPendingTasks = cache(
  async (
    householdId: string,
    options: { spaceId?: string | null } = {},
  ): Promise<TaskWithRelations[]> => {
    await requireUser();
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("tasks")
      .select(TASK_SELECT)
      .eq("household_id", householdId)
      .eq("status", "pending")
      .is("parent_task_id", null);

    if (options.spaceId === null) {
      query = query.is("space_id", null);
    } else if (options.spaceId !== undefined) {
      query = query.eq("space_id", options.spaceId);
    }

    const { data, error } = await query
      .order("due_at", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) throwQueryError(error, "Loading pending tasks");
    return (data ?? []) as unknown as TaskWithRelations[];
  },
);

/**
 * Bulk-fetch subtasks for a set of parent task IDs. Returned tasks include
 * both pending and completed (so users can see the project's history in
 * the drawer); skipped is excluded.
 */
export const getSubtasksByParents = cache(
  async (parentIds: readonly string[]): Promise<Map<string, TaskWithRelations[]>> => {
    if (parentIds.length === 0) return new Map();
    await requireUser();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("tasks")
      .select(TASK_SELECT)
      .in("parent_task_id", parentIds as string[])
      .in("status", ["pending", "completed"])
      .order("status", { ascending: true })
      .order("position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) throwQueryError(error, "Loading subtasks");

    const map = new Map<string, TaskWithRelations[]>();
    for (const row of (data ?? []) as unknown as TaskWithRelations[]) {
      if (!row.parent_task_id) continue;
      const list = map.get(row.parent_task_id) ?? [];
      list.push(row);
      map.set(row.parent_task_id, list);
    }
    return map;
  },
);

/** Combine top-level tasks with their pending/completed children. */
export async function withSubtasks(topLevel: TaskWithRelations[]): Promise<TaskWithSubtasks[]> {
  const map = await getSubtasksByParents(topLevel.map((t) => t.id));
  return topLevel.map((t) => ({ ...t, subtasks: map.get(t.id) ?? [] }));
}

export const getCompletedTasks = cache(
  async (householdId: string, limit = 50): Promise<TaskWithRelations[]> => {
    await requireUser();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("tasks")
      .select(TASK_SELECT)
      .eq("household_id", householdId)
      .eq("status", "completed")
      .is("parent_task_id", null)
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) throwQueryError(error, "Loading completed tasks");
    return (data ?? []) as unknown as TaskWithRelations[];
  },
);

export interface TaskCounts {
  total: number;
  byStatus: Record<TaskStatus, number>;
}

export async function getTaskCounts(householdId: string): Promise<TaskCounts> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("status")
    .eq("household_id", householdId);

  if (error) throwQueryError(error, "Loading task counts");

  const counts: TaskCounts = {
    total: data?.length ?? 0,
    byStatus: { pending: 0, completed: 0, skipped: 0 },
  };

  for (const row of data ?? []) {
    counts.byStatus[row.status as TaskStatus] += 1;
  }

  return counts;
}
