import { z } from "zod";

import { HEX_COLOR_REGEX, SPACE_COLOR_ORDER } from "@/features/spaces/colors";

export const spaceColorSchema = z.union([
  z.enum(SPACE_COLOR_ORDER),
  z
    .string()
    .regex(HEX_COLOR_REGEX, "Use a 6-digit hex like #4a90e2")
    .transform((s) => s.toLowerCase()),
]);

const nameSchema = z
  .string()
  .trim()
  .min(1, "Give the space a name")
  .max(60, "60 characters or fewer");

export const createSpaceSchema = z.object({
  name: nameSchema,
  color: spaceColorSchema.default("slate"),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export type CreateSpaceValues = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceValues = z.infer<typeof updateSpaceSchema>;
