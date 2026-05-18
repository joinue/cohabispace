import { describe, expect, it } from "vitest";

import { forgotPasswordSchema, resetPasswordSchema, signInSchema, signUpSchema } from "./schemas";

describe("signInSchema", () => {
  it("trims and lowercases the email", () => {
    const parsed = signInSchema.parse({ email: "  USER@Example.COM ", password: "x" });
    expect(parsed.email).toBe("user@example.com");
  });

  it("rejects a missing password", () => {
    const result = signInSchema.safeParse({ email: "a@b.co", password: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signInSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.success).toBe(false);
  });

  it("accepts a single-character password (only sign-up enforces length)", () => {
    const result = signInSchema.safeParse({ email: "a@b.co", password: "x" });
    expect(result.success).toBe(true);
  });
});

describe("signUpSchema", () => {
  const valid = {
    email: "user@example.com",
    password: "longenoughpw",
    displayName: "Alex",
  };

  it("accepts a valid payload", () => {
    expect(signUpSchema.parse(valid)).toEqual({
      email: "user@example.com",
      password: "longenoughpw",
      displayName: "Alex",
    });
  });

  it("rejects passwords shorter than 8 characters", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "password")).toBe(true);
    }
  });

  it("rejects passwords longer than 72 characters", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "a".repeat(73) });
    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only display name", () => {
    const result = signUpSchema.safeParse({ ...valid, displayName: "   " });
    expect(result.success).toBe(false);
  });

  it("trims the display name", () => {
    const parsed = signUpSchema.parse({ ...valid, displayName: "  Alex  " });
    expect(parsed.displayName).toBe("Alex");
  });

  it("rejects display names longer than 80 characters", () => {
    const result = signUpSchema.safeParse({ ...valid, displayName: "a".repeat(81) });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(forgotPasswordSchema.parse({ email: "user@example.com" })).toEqual({
      email: "user@example.com",
    });
  });

  it("rejects malformed input", () => {
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts matching passwords that meet the length rule", () => {
    const result = resetPasswordSchema.safeParse({
      password: "longenoughpw",
      confirmPassword: "longenoughpw",
    });
    expect(result.success).toBe(true);
  });

  it("flags a mismatch on `confirmPassword`", () => {
    const result = resetPasswordSchema.safeParse({
      password: "longenoughpw",
      confirmPassword: "different-pw",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const mismatch = result.error.issues.find((i) => i.path[0] === "confirmPassword");
      expect(mismatch?.message).toBe("Passwords don't match");
    }
  });

  it("rejects short passwords even when they match", () => {
    const result = resetPasswordSchema.safeParse({
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });
});
