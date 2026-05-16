import { describe, expect, it } from "vitest";

import { mergeTags, parseHashtags } from "./tags";

describe("parseHashtags", () => {
  it("extracts a single tag and strips it from the title", () => {
    expect(parseHashtags("Take out the trash #home")).toEqual({
      title: "Take out the trash",
      tags: ["home"],
    });
  });

  it("extracts multiple tags", () => {
    const { title, tags } = parseHashtags("Buy milk #groceries #urgent");
    expect(title).toBe("Buy milk");
    expect(tags.sort()).toEqual(["groceries", "urgent"]);
  });

  it("lowercases and de-duplicates tags", () => {
    const { tags } = parseHashtags("Plan #Home things #home #HOME");
    expect(tags).toEqual(["home"]);
  });

  it("does not treat mid-word `#` as a hashtag", () => {
    expect(parseHashtags("Learn C# basics")).toEqual({
      title: "Learn C# basics",
      tags: [],
    });
    expect(parseHashtags("Order room#3 supplies")).toEqual({
      title: "Order room#3 supplies",
      tags: [],
    });
  });

  it("preserves a single space between adjacent words when a hashtag is stripped", () => {
    expect(parseHashtags("Pay #bills today")).toEqual({
      title: "Pay today",
      tags: ["bills"],
    });
  });

  it("ignores hashtag names longer than 32 chars", () => {
    const long = "a".repeat(33);
    const { tags, title } = parseHashtags(`Note #${long} done`);
    expect(tags).toEqual([]);
    expect(title).toContain(`#${long}`);
  });

  it("accepts hyphens, underscores, and digits in tag names", () => {
    const { tags } = parseHashtags("Test #weekly-review #q1_2026 #v2");
    expect(tags.sort()).toEqual(["q1_2026", "v2", "weekly-review"]);
  });

  it("returns empty tags for input with no hashtags", () => {
    expect(parseHashtags("Just a plain task")).toEqual({
      title: "Just a plain task",
      tags: [],
    });
  });
});

describe("mergeTags", () => {
  it("merges and lowercases existing tags while preserving parsed ones", () => {
    expect(mergeTags(["home"], ["Errands", "HOME"]).sort()).toEqual(["errands", "home"]);
  });

  it("returns parsed tags when no existing tags are passed", () => {
    expect(mergeTags(["a", "b"])).toEqual(["a", "b"]);
  });
});
