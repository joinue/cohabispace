import { describe, expect, it } from "vitest";

import { createTaskSchema, taskStatusSchema, updateTaskSchema } from "./schemas";

const UUID = "11111111-1111-4111-8111-111111111111";

describe("taskStatusSchema", () => {
  it.each(["pending", "completed", "skipped"] as const)("accepts %s", (status) => {
    expect(taskStatusSchema.parse(status)).toBe(status);
  });

  it("rejects unknown statuses", () => {
    expect(taskStatusSchema.safeParse("archived").success).toBe(false);
  });
});

describe("createTaskSchema", () => {
  it("accepts a minimal title-only task and leaves optional fields nullish", () => {
    const parsed = createTaskSchema.parse({ title: "Take out the trash" });
    expect(parsed.title).toBe("Take out the trash");
    expect(parsed.notes ?? null).toBeNull();
    expect(parsed.dueAt ?? null).toBeNull();
    expect(parsed.assignedTo ?? null).toBeNull();
    expect(parsed.parentTaskId ?? null).toBeNull();
    expect(parsed.spaceId ?? null).toBeNull();
    expect(parsed.rrule ?? null).toBeNull();
  });

  it("trims the title", () => {
    expect(createTaskSchema.parse({ title: "  Mow lawn  " }).title).toBe("Mow lawn");
  });

  it("rejects an empty or whitespace-only title", () => {
    expect(createTaskSchema.safeParse({ title: "" }).success).toBe(false);
    expect(createTaskSchema.safeParse({ title: "   " }).success).toBe(false);
  });

  it("rejects titles longer than 200 characters", () => {
    expect(createTaskSchema.safeParse({ title: "a".repeat(201) }).success).toBe(false);
  });

  it("rejects notes longer than 2000 characters", () => {
    const result = createTaskSchema.safeParse({
      title: "x",
      notes: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("normalizes blank-string optional fields to null", () => {
    const parsed = createTaskSchema.parse({
      title: "x",
      notes: "",
      dueAt: "  ",
      assignedTo: "",
      parentTaskId: "",
      spaceId: "",
      rrule: "",
    });
    expect(parsed.notes).toBeNull();
    expect(parsed.dueAt).toBeNull();
    expect(parsed.assignedTo).toBeNull();
    expect(parsed.parentTaskId).toBeNull();
    expect(parsed.spaceId).toBeNull();
    expect(parsed.rrule).toBeNull();
  });

  it("rejects non-UUID values for uuid fields", () => {
    expect(createTaskSchema.safeParse({ title: "x", assignedTo: "not-a-uuid" }).success).toBe(
      false,
    );
  });

  it("accepts well-formed UUIDs", () => {
    const parsed = createTaskSchema.parse({
      title: "x",
      assignedTo: UUID,
      parentTaskId: UUID,
      spaceId: UUID,
    });
    expect(parsed.assignedTo).toBe(UUID);
    expect(parsed.spaceId).toBe(UUID);
  });
});

describe("updateTaskSchema", () => {
  it("accepts a fully empty object (all fields optional)", () => {
    expect(updateTaskSchema.parse({})).toEqual({});
  });

  it("still validates fields that are present", () => {
    expect(updateTaskSchema.safeParse({ title: "" }).success).toBe(false);
    expect(updateTaskSchema.safeParse({ assignedTo: "nope" }).success).toBe(false);
  });

  it("preserves blank-to-null normalization for partial updates", () => {
    const parsed = updateTaskSchema.parse({ assignedTo: "" });
    expect(parsed.assignedTo).toBeNull();
  });
});
