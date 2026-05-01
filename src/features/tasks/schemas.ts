import { z } from "zod";

export const taskStatusSchema = z.enum(["pending", "completed", "skipped"]);

const titleSchema = z
  .string()
  .trim()
  .min(1, "Give the task a title")
  .max(200, "200 characters or fewer");

const notesSchema = z.string().trim().max(2000, "2000 characters or fewer").optional();

const dueAtSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

const uuidSchema = z.string().uuid().optional();

export const createTaskSchema = z.object({
  title: titleSchema,
  notes: notesSchema,
  dueAt: dueAtSchema,
  assignedTo: uuidSchema,
  parentTaskId: uuidSchema,
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskValues = z.infer<typeof updateTaskSchema>;
