import { describe, expect, it } from "vitest";

import { SPACE_COLOR_ORDER } from "./colors";
import { createSpaceSchema, spaceColorSchema, updateSpaceSchema } from "./schemas";

describe("spaceColorSchema", () => {
  it.each(SPACE_COLOR_ORDER)("accepts the palette color %s", (color) => {
    expect(spaceColorSchema.parse(color)).toBe(color);
  });

  it("rejects unknown colors", () => {
    expect(spaceColorSchema.safeParse("fuchsia").success).toBe(false);
  });

  it("accepts a 6-digit hex color", () => {
    expect(spaceColorSchema.parse("#4A90E2")).toBe("#4a90e2");
  });

  it("rejects 3-digit, malformed, or non-hex strings", () => {
    expect(spaceColorSchema.safeParse("#abc").success).toBe(false);
    expect(spaceColorSchema.safeParse("4a90e2").success).toBe(false);
    expect(spaceColorSchema.safeParse("#ggggggg").success).toBe(false);
    expect(spaceColorSchema.safeParse("#1234567").success).toBe(false);
  });
});

describe("createSpaceSchema", () => {
  it("defaults color to slate when omitted", () => {
    expect(createSpaceSchema.parse({ name: "Kitchen" })).toEqual({
      name: "Kitchen",
      color: "slate",
    });
  });

  it("trims the name", () => {
    expect(createSpaceSchema.parse({ name: "  Garage  " }).name).toBe("Garage");
  });

  it("rejects an empty or whitespace name", () => {
    expect(createSpaceSchema.safeParse({ name: "" }).success).toBe(false);
    expect(createSpaceSchema.safeParse({ name: "   " }).success).toBe(false);
  });

  it("rejects names longer than 60 characters", () => {
    expect(createSpaceSchema.safeParse({ name: "a".repeat(61) }).success).toBe(false);
  });
});

describe("updateSpaceSchema", () => {
  it("accepts a fully empty object", () => {
    expect(updateSpaceSchema.parse({})).toEqual({});
  });

  it("still rejects a bad color when supplied", () => {
    expect(updateSpaceSchema.safeParse({ color: "fuchsia" }).success).toBe(false);
  });
});
