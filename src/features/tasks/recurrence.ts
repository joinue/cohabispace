import { format } from "date-fns";
import { Frequency, RRule, type Weekday } from "rrule";

/**
 * Recurrence helpers built on top of `rrule` (RFC 5545 RRULE).
 *
 * The DB stores only the rule string on the task row. Each pending task
 * is one occurrence; when the user completes it, the action computes
 * the next occurrence and inserts a fresh task — preserving the
 * `series_id` so we can find the chain.
 */

/** Stored RRULE strings — five user-facing presets. */
export type RecurrencePresetId = "daily" | "weekdays" | "weekly" | "biweekly" | "monthly";

const WEEKDAY_BYDAY: Record<number, Weekday> = {
  0: RRule.SU,
  1: RRule.MO,
  2: RRule.TU,
  3: RRule.WE,
  4: RRule.TH,
  5: RRule.FR,
  6: RRule.SA,
};

function weekdayOf(d: Date): Weekday {
  return WEEKDAY_BYDAY[d.getDay()] ?? RRule.MO;
}

/**
 * Build the RRULE string for a preset, anchored against `dtstart`.
 * If no anchor is given, presets that need one (weekly/biweekly/monthly)
 * use today.
 */
export function buildPresetRule(preset: RecurrencePresetId, dtstart: Date | null): string {
  const anchor = dtstart ?? new Date();
  switch (preset) {
    case "daily":
      return new RRule({ freq: Frequency.DAILY }).toString();
    case "weekdays":
      return new RRule({
        freq: Frequency.WEEKLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
      }).toString();
    case "weekly":
      return new RRule({
        freq: Frequency.WEEKLY,
        byweekday: [weekdayOf(anchor)],
      }).toString();
    case "biweekly":
      return new RRule({
        freq: Frequency.WEEKLY,
        interval: 2,
        byweekday: [weekdayOf(anchor)],
      }).toString();
    case "monthly":
      return new RRule({
        freq: Frequency.MONTHLY,
        bymonthday: [anchor.getDate()],
      }).toString();
  }
}

/** Human-readable summary of a stored RRULE. Returns null if it can't parse. */
export function describeRule(rrule: string | null): string | null {
  if (!rrule) return null;
  try {
    const rule = RRule.fromString(rrule);
    return rule.toText().replace(/^./, (c) => c.toUpperCase());
  } catch {
    return "Repeats";
  }
}

/**
 * Compute the next occurrence after `after`, given the rule.
 * Returns null if the rule has ended (UNTIL/COUNT exhausted).
 */
export function nextOccurrence(rrule: string, after: Date): Date | null {
  try {
    const rule = RRule.fromString(rrule);
    return rule.after(after, false);
  } catch {
    return null;
  }
}

export interface RecurrencePresetOption {
  id: RecurrencePresetId;
  /** Short label shown in the popover. */
  label: string;
  /** Long-form preview shown next to it (e.g. "Every Mon"). */
  preview: (anchor: Date | null) => string;
}

export const RECURRENCE_PRESETS: RecurrencePresetOption[] = [
  {
    id: "daily",
    label: "Daily",
    preview: () => "Every day",
  },
  {
    id: "weekdays",
    label: "Weekdays",
    preview: () => "Mon – Fri",
  },
  {
    id: "weekly",
    label: "Weekly",
    preview: (a) => (a ? `Every ${format(a, "EEE")}` : "Every week"),
  },
  {
    id: "biweekly",
    label: "Every 2 weeks",
    preview: (a) => (a ? `Every other ${format(a, "EEE")}` : "Every 2 weeks"),
  },
  {
    id: "monthly",
    label: "Monthly",
    preview: (a) => (a ? `Day ${a.getDate()} of the month` : "Same date each month"),
  },
];

/** Try to identify which preset matches an existing rrule (for the picker UI). */
export function matchPreset(rrule: string | null): RecurrencePresetId | null {
  if (!rrule) return null;
  try {
    const opts = RRule.fromString(rrule).origOptions;
    if (opts.freq === Frequency.DAILY) return "daily";
    if (opts.freq === Frequency.WEEKLY) {
      const days = Array.isArray(opts.byweekday)
        ? opts.byweekday
        : opts.byweekday
          ? [opts.byweekday]
          : [];
      const len = days.length;
      if (len === 5) return "weekdays";
      if (opts.interval === 2) return "biweekly";
      return "weekly";
    }
    if (opts.freq === Frequency.MONTHLY) return "monthly";
    return null;
  } catch {
    return null;
  }
}
