import { describe, expect, it } from "vitest";

import { createInvitationSchema, inviteRoleSchema } from "./schemas";

describe("inviteRoleSchema", () => {
  it.each(["admin", "adult", "teen", "child", "guest"] as const)(
    "accepts non-owner role %s",
    (role) => {
      expect(inviteRoleSchema.parse(role)).toBe(role);
    },
  );

  it("rejects 'owner' (cannot be granted via invite)", () => {
    expect(inviteRoleSchema.safeParse("owner").success).toBe(false);
  });

  it("rejects unknown roles", () => {
    expect(inviteRoleSchema.safeParse("superuser").success).toBe(false);
  });
});

describe("createInvitationSchema", () => {
  it("defaults the role to 'adult' when omitted", () => {
    expect(createInvitationSchema.parse({ email: "Friend@Example.com" })).toEqual({
      email: "friend@example.com",
      role: "adult",
    });
  });

  it("trims and lowercases the email", () => {
    const parsed = createInvitationSchema.parse({
      email: "  UPPER@Example.COM ",
      role: "guest",
    });
    expect(parsed.email).toBe("upper@example.com");
  });

  it("rejects malformed emails", () => {
    expect(createInvitationSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });

  it("rejects owner as a role", () => {
    expect(createInvitationSchema.safeParse({ email: "a@b.co", role: "owner" }).success).toBe(
      false,
    );
  });
});
