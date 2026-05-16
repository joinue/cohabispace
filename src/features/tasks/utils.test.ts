import { addDays, setHours, startOfDay } from "date-fns";
import { describe, expect, it } from "vitest";

import { classifyDue, groupTasksByDue } from "./utils";

function isoAt(daysFromNow: number, hour = 12): string {
  return setHours(startOfDay(addDays(new Date(), daysFromNow)), hour).toISOString();
}

describe("classifyDue", () => {
  it("returns 'noDate' when no due date is set", () => {
    expect(classifyDue(null)).toBe("noDate");
  });

  it("returns 'today' for a date later today", () => {
    expect(classifyDue(isoAt(0, 23))).toBe("today");
  });

  it("returns 'overdue' for a date two days in the past", () => {
    expect(classifyDue(isoAt(-2))).toBe("overdue");
  });

  it("returns 'tomorrow' for the next calendar day", () => {
    expect(classifyDue(isoAt(1))).toBe("tomorrow");
  });

  it("returns 'later' for a date two weeks out", () => {
    expect(classifyDue(isoAt(14))).toBe("later");
  });
});

describe("groupTasksByDue", () => {
  it("buckets each task into its classified group", () => {
    const tasks = [
      { id: "a", due_at: null },
      { id: "b", due_at: isoAt(0, 23) },
      { id: "c", due_at: isoAt(-2) },
      { id: "d", due_at: isoAt(1) },
      { id: "e", due_at: isoAt(30) },
    ];
    const groups = groupTasksByDue(tasks);
    expect(groups.noDate.map((t) => t.id)).toEqual(["a"]);
    expect(groups.today.map((t) => t.id)).toEqual(["b"]);
    expect(groups.overdue.map((t) => t.id)).toEqual(["c"]);
    expect(groups.tomorrow.map((t) => t.id)).toEqual(["d"]);
    expect(groups.later.map((t) => t.id)).toEqual(["e"]);
  });

  it("returns empty arrays for empty input", () => {
    const groups = groupTasksByDue([]);
    expect(groups.overdue).toEqual([]);
    expect(groups.today).toEqual([]);
    expect(groups.tomorrow).toEqual([]);
    expect(groups.thisWeek).toEqual([]);
    expect(groups.later).toEqual([]);
    expect(groups.noDate).toEqual([]);
  });
});
