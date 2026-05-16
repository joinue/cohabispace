import { z } from "zod";

export const taskStatusSchema = z.enum(["pending", "completed", "skipped"]);

/**
 * Forms send `""` (not `undefined`) for unset hidden inputs like
 * `<input type="hidden" name="dueAt" value="" />`. Treat blank strings as
 * `null` so optional schemas accept "no value" and update actions can
 * distinguish "user submitted empty (clear)" from "field not in form (skip)".
 */
const blankToNull = (v: unknown): unknown => {
  if (typeof v === "string" && v.trim().length === 0) return null;
  return v;
};

const titleSchema = z
  .string()
  .trim()
  .min(1, "Give the task a title")
  .max(200, "200 characters or fewer");

const notesSchema = z.preprocess(
  blankToNull,
  z.string().trim().max(2000, "2000 characters or fewer").nullish(),
);

const dueAtSchema = z.preprocess(blankToNull, z.string().trim().min(1).nullish());

const uuidSchema = z.preprocess(blankToNull, z.string().uuid().nullish());

const rruleSchema = z.preprocess(blankToNull, z.string().trim().max(1000).nullish());

export const createTaskSchema = z.object({
  title: titleSchema,
  notes: notesSchema,
  dueAt: dueAtSchema,
  assignedTo: uuidSchema,
  parentTaskId: uuidSchema,
  spaceId: uuidSchema,
  rrule: rruleSchema,
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskValues = z.infer<typeof updateTaskSchema>;
