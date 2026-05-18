import { describe, expect, it } from "vitest";
import { z } from "zod";

import { fieldErrorsFromZod } from "./forms";

const schema = z.object({
  email: z.string().email("bad email"),
  password: z.string().min(8, "too short"),
});

describe("fieldErrorsFromZod", () => {
  it("groups issues by their dotted path", () => {
    const result = schema.safeParse({ email: "nope", password: "x" });
    expect(result.success).toBe(false);
    if (result.success) return;
    const errs = fieldErrorsFromZod(result.error.issues);
    expect(errs.email).toEqual(["bad email"]);
    expect(errs.password).toEqual(["too short"]);
  });

  it("collects multiple messages under the same key", () => {
    const issues = [
      { path: ["password"], message: "too short", code: "custom" },
      { path: ["password"], message: "must contain a number", code: "custom" },
    ] as unknown as Parameters<typeof fieldErrorsFromZod>[0];
    expect(fieldErrorsFromZod(issues)).toEqual({
      password: ["too short", "must contain a number"],
    });
  });

  it("joins nested paths with `.`", () => {
    const issues = [
      { path: ["user", "email"], message: "bad email", code: "custom" },
    ] as unknown as Parameters<typeof fieldErrorsFromZod>[0];
    expect(fieldErrorsFromZod(issues)).toEqual({ "user.email": ["bad email"] });
  });

  it("skips issues with an empty path (top-level form errors)", () => {
    const issues = [{ path: [], message: "form-level", code: "custom" }] as unknown as Parameters<
      typeof fieldErrorsFromZod
    >[0];
    expect(fieldErrorsFromZod(issues)).toEqual({});
  });

  it("returns an empty object when given no issues", () => {
    expect(fieldErrorsFromZod([])).toEqual({});
  });
});
