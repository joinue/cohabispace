"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { requireUser } from "@/lib/dal";
import { type FormState, fieldErrorsFromZod } from "@/lib/forms";
import { createTaskSchema, updateTaskSchema } from "@/features/tasks/schemas";
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
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const service = createSupabaseServiceClient();
  const { error } = await service.from("tasks").insert({
    household_id: householdId,
    title: parsed.data.title,
    notes: emptyToNull(parsed.data.notes),
    due_at: emptyToNull(parsed.data.dueAt),
    assigned_to: emptyToNull(parsed.data.assignedTo),
    parent_task_id: emptyToNull(parsed.data.parentTaskId),
    created_by: user.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  return {};
}

export async function completeTaskAction(taskId: string) {
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
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      completed_by: user.id,
    })
    .eq("id", taskId);

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
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

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
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

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
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
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const update: TaskUpdate = {};
  if (parsed.data.title !== undefined) update.title = parsed.data.title;
  if (parsed.data.notes !== undefined) update.notes = emptyToNull(parsed.data.notes);
  if (parsed.data.dueAt !== undefined) update.due_at = emptyToNull(parsed.data.dueAt);
  if (parsed.data.assignedTo !== undefined)
    update.assigned_to = emptyToNull(parsed.data.assignedTo);

  if (Object.keys(update).length === 0) return {};

  const { error } = await service.from("tasks").update(update).eq("id", taskId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  return {};
}
