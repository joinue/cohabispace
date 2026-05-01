import { z } from "zod";

import { SPACE_COLOR_ORDER } from "@/features/spaces/colors";

export const spaceColorSchema = z.enum(SPACE_COLOR_ORDER);

const nameSchema = z
  .string()
  .trim()
  .min(1, "Give the space a name")
  .max(60, "60 characters or fewer");

const iconSchema = z
  .string()
  .trim()
  .max(8, "Icons must be a single emoji")
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

export const createSpaceSchema = z.object({
  name: nameSchema,
  icon: iconSchema,
  color: spaceColorSchema.default("slate"),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export type CreateSpaceValues = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceValues = z.infer<typeof updateSpaceSchema>;
