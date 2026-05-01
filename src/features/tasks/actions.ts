"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { requireUser } from "@/lib/dal";
import { type FormState, fieldErrorsFromZod } from "@/lib/forms";
import { createTaskSchema, updateTaskSchema } from "@/features/tasks/schemas";
import { nextOccurrence } from "@/features/tasks/recurrence";
import { parseHashtags } from "@/features/tasks/tags";
import type { Database } from "@/lib/supabase/database.types";

type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

async function requireMembership(userId: string, householdId: string) {
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("household_members")
    .select("role")
    .eq("household_id", householdId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return { ok: false as const, error: "You're not a member of that household." };
  return { ok: true as const, role: data.role };
}

function emptyToNull<T extends string | undefined>(v: T): string | null {
  return v && v.length > 0 ? v : null;
}

export async function createTaskAction(
  householdId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const member = await requireMembership(user.id, householdId);
  if (!member.ok) return { error: member.error };

  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    notes: formData.get("notes") ?? undefined,
    dueAt: formData.get("dueAt") ?? undefined,
    assignedTo: formData.get("assignedTo") ?? undefined,
    parentTaskId: formData.get("parentTaskId") ?? undefined,
    spaceId: formData.get("spaceId") ?? undefined,
    rrule: formData.get("rrule") ?? undefined,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const { title: cleanTitle, tags } = parseHashtags(parsed.data.title);

  const service = createSupabaseServiceClient();
  const { error } = await service.from("tasks").insert({
    household_id: householdId,
    title: cleanTitle,
    tags,
    notes: emptyToNull(parsed.data.notes),
    due_at: emptyToNull(parsed.data.dueAt),
    assigned_to: emptyToNull(parsed.data.assignedTo),
    parent_task_id: emptyToNull(parsed.data.parentTaskId),
    space_id: emptyToNull(parsed.data.spaceId),
    rrule: emptyToNull(parsed.data.rrule),
    created_by: user.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}

export async function completeTaskAction(taskId: string) {
  const user = await requireUser();
  const service = createSupabaseServiceClient();

  const { data: task } = await service.from("tasks").select("*").eq("id", taskId).maybeSingle();
  if (!task) return;

  const member = await requireMembership(user.id, task.household_id);
  if (!member.ok) return;

  // If this is a recurring task with a due date, spawn the next instance
  // BEFORE marking the current one complete — so a transient error doesn't
  // leave the user without their next occurrence.
  if (task.rrule && task.due_at) {
    const next = nextOccurrence(task.rrule, new Date(task.due_at));
    if (next) {
      await service.from("tasks").insert({
        household_id: task.household_id,
        title: task.title,
        notes: task.notes,
        due_at: next.toISOString(),
        assigned_to: task.assigned_to,
        space_id: task.space_id,
        parent_task_id: task.parent_task_id,
        series_id: task.series_id,
        rrule: task.rrule,
        tags: task.tags,
        created_by: task.created_by,
      });
    }
  }

  await service
    .from("tasks")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      completed_by: user.id,
    })
    .eq("id", taskId);

  revalidatePath("/", "layout");
}

export async function uncompleteTaskAction(taskId: string) {
  const user = await requireUser();
  const service = createSupabaseServiceClient();

  const { data: task } = await service
    .from("tasks")
    .select("household_id")
    .eq("id", taskId)
    .maybeSingle();
  if (!task) return;

  const member = await requireMembership(user.id, task.household_id);
  if (!member.ok) return;

  await service
    .from("tasks")
    .update({ status: "pending", completed_at: null, completed_by: null })
    .eq("id", taskId);

  revalidatePath("/", "layout");
}

export async function deleteTaskAction(taskId: string) {
  const user = await requireUser();
  const service = createSupabaseServiceClient();

  const { data: task } = await service
    .from("tasks")
    .select("household_id, created_by")
    .eq("id", taskId)
    .maybeSingle();
  if (!task) return;

  const member = await requireMembership(user.id, task.household_id);
  if (!member.ok) return;

  // Only creator or household admin can delete.
  const canDelete =
    task.created_by === user.id || member.role === "owner" || member.role === "admin";
  if (!canDelete) return;

  await service.from("tasks").delete().eq("id", taskId);

  revalidatePath("/", "layout");
}

export async function updateTaskAction(
  taskId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const service = createSupabaseServiceClient();

  const { data: task } = await service
    .from("tasks")
    .select("household_id")
    .eq("id", taskId)
    .maybeSingle();
  if (!task) return { error: "Task not found." };

  const member = await requireMembership(user.id, task.household_id);
  if (!member.ok) return { error: member.error };

  const parsed = updateTaskSchema.safeParse({
    title: formData.get("title") ?? undefined,
    notes: formData.get("notes") ?? undefined,
    dueAt: formData.get("dueAt") ?? undefined,
    assignedTo: formData.get("assignedTo") ?? undefined,
    spaceId: formData.get("spaceId") ?? undefined,
    rrule: formData.get("rrule") ?? undefined,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const update: TaskUpdate = {};
  if (parsed.data.title !== undefined) {
    const { title: cleanTitle, tags } = parseHashtags(parsed.data.title);
    update.title = cleanTitle;
    update.tags = tags;
  }
  if (parsed.data.notes !== undefined) update.notes = emptyToNull(parsed.data.notes);
  if (parsed.data.dueAt !== undefined) update.due_at = emptyToNull(parsed.data.dueAt);
  if (parsed.data.assignedTo !== undefined)
    update.assigned_to = emptyToNull(parsed.data.assignedTo);
  if (parsed.data.spaceId !== undefined) update.space_id = emptyToNull(parsed.data.spaceId);
  if (parsed.data.rrule !== undefined) update.rrule = emptyToNull(parsed.data.rrule);

  if (Object.keys(update).length === 0) return {};

  const { error } = await service.from("tasks").update(update).eq("id", taskId);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}
