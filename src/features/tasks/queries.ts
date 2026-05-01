import "server-only";

import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
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

    if (error) throw error;
    return (data ?? []) as unknown as TaskWithRelations[];
  },
);

export const getCompletedTasks = cache(
  async (householdId: string, limit = 50): Promise<TaskWithRelations[]> => {
    await requireUser();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("tasks")
      .select(TASK_SELECT)
      .eq("household_id", householdId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
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

  if (error) throw error;

  const counts: TaskCounts = {
    total: data?.length ?? 0,
    byStatus: { pending: 0, completed: 0, skipped: 0 },
  };

  for (const row of data ?? []) {
    counts.byStatus[row.status as TaskStatus] += 1;
  }

  return counts;
}
