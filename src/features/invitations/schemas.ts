import { z } from "zod";

import { householdRoleSchema } from "@/features/households/schemas";

export const inviteRoleSchema = householdRoleSchema.exclude(["owner"]);

export const createInvitationSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  role: inviteRoleSchema.default("adult"),
});

export type CreateInvitationValues = z.infer<typeof createInvitationSchema>;
export type InviteRole = z.infer<typeof inviteRoleSchema>;
