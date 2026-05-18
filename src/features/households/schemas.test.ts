import { describe, expect, it } from "vitest";

import { createHouseholdSchema, householdRoleSchema, renameHouseholdSchema } from "./schemas";

describe("householdRoleSchema", () => {
  it.each(["owner", "admin", "adult", "teen", "child", "guest"] as const)("accepts %s", (role) => {
    expect(householdRoleSchema.parse(role)).toBe(role);
  });

  it("rejects unknown roles", () => {
    expect(householdRoleSchema.safeParse("superuser").success).toBe(false);
  });
});

describe("createHouseholdSchema", () => {
  it("trims the name", () => {
    expect(createHouseholdSchema.parse({ name: "  Salerno HQ  " }).name).toBe("Salerno HQ");
  });

  it("rejects empty or whitespace names", () => {
    expect(createHouseholdSchema.safeParse({ name: "" }).success).toBe(false);
    expect(createHouseholdSchema.safeParse({ name: "   " }).success).toBe(false);
  });

  it("rejects names longer than 80 characters", () => {
    expect(createHouseholdSchema.safeParse({ name: "a".repeat(81) }).success).toBe(false);
  });
});

describe("renameHouseholdSchema", () => {
  it("shares the create schema's rules", () => {
    expect(renameHouseholdSchema.safeParse({ name: "" }).success).toBe(false);
    expect(renameHouseholdSchema.parse({ name: "  Cabin  " }).name).toBe("Cabin");
  });
});
