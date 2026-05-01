import { z } from "zod";

export const householdRoleSchema = z.enum(["owner", "admin", "adult", "teen", "child", "guest"]);

export const createHouseholdSchema = z.object({
  name: z.string().trim().min(1, "Give your household a name").max(80, "80 characters or fewer"),
});

export const renameHouseholdSchema = createHouseholdSchema;

export type CreateHouseholdValues = z.infer<typeof createHouseholdSchema>;
export type HouseholdRoleValue = z.infer<typeof householdRoleSchema>;
