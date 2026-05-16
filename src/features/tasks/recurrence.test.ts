import { describe, expect, it } from "vitest";
import { Frequency, RRule } from "rrule";

import {
  buildPresetRule,
  describeRule,
  matchPreset,
  nextOccurrence,
  type RecurrencePresetId,
} from "./recurrence";

const PRESETS: RecurrencePresetId[] = ["daily", "weekdays", "weekly", "biweekly", "monthly"];

describe("buildPresetRule + matchPreset", () => {
  it.each(PRESETS)("round-trips %s through matchPreset", (preset) => {
    const anchor = new Date(2026, 0, 14, 12);
    const rule = buildPresetRule(preset, anchor);
    expect(matchPreset(rule)).toBe(preset);
  });

  it("anchors weekly to the anchor's weekday", () => {
    const anchor = new Date(2026, 0, 14, 12);
    const rule = RRule.fromString(buildPresetRule("weekly", anchor));
    expect(rule.origOptions.freq).toBe(Frequency.WEEKLY);
    const days = Array.isArray(rule.origOptions.byweekday)
      ? rule.origOptions.byweekday
      : rule.origOptions.byweekday
        ? [rule.origOptions.byweekday]
        : [];
    expect(days).toHaveLength(1);
  });

  it("anchors monthly to the anchor's day-of-month", () => {
    const fifteenth = new Date(2026, 5, 15, 12);
    const rule = RRule.fromString(buildPresetRule("monthly", fifteenth));
    expect(rule.origOptions.freq).toBe(Frequency.MONTHLY);
    expect(rule.origOptions.bymonthday).toBe(15);
  });

  it("falls back to today when no anchor is given", () => {
    const rule = buildPresetRule("weekly", null);
    expect(matchPreset(rule)).toBe("weekly");
  });
});

describe("describeRule", () => {
  it("returns null for null input", () => {
    expect(describeRule(null)).toBeNull();
  });

  it("returns a sentence-cased human description for a valid rule", () => {
    const rule = buildPresetRule("daily", null);
    const desc = describeRule(rule);
    expect(desc).toBeTruthy();
    expect(desc?.[0]).toBe(desc?.[0]?.toUpperCase());
  });

  it('returns the fallback "Repeats" for an unparseable rule', () => {
    expect(describeRule("not a real rrule")).toBe("Repeats");
  });
});

describe("nextOccurrence", () => {
  it("advances past the given anchor date", () => {
    const rule = buildPresetRule("daily", null);
    const after = new Date(Date.UTC(2026, 0, 1, 12));
    const next = nextOccurrence(rule, after);
    expect(next).not.toBeNull();
    expect(next!.getTime()).toBeGreaterThan(after.getTime());
  });

  it("returns null for an invalid rule string", () => {
    expect(nextOccurrence("garbage", new Date())).toBeNull();
  });
});

describe("matchPreset", () => {
  it("returns null for null input", () => {
    expect(matchPreset(null)).toBeNull();
  });

  it("returns null for an unparseable rule", () => {
    expect(matchPreset("not an rrule")).toBeNull();
  });
});
