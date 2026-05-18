import type { CSSProperties } from "react";

import type { SpaceColor, SpacePresetColor } from "@/lib/supabase/database.types";

/**
 * Curated palette of space colors. Picked for legibility against both
 * light and dark surfaces with `/12` background tones and `-500/-400`
 * dot/foreground tones.
 *
 * Tailwind doesn't generate utility classes from runtime strings, so we
 * declare the full classes here and look them up by token. JIT picks
 * them up because they're literal class strings in source.
 */
export interface SpaceColorTokens {
  /** Soft tinted background, used in pills and hover states. */
  bg: string;
  /** Foreground text color paired with `bg`. */
  fg: string;
  /** Solid colored dot, used for legend / picker tiles. */
  dot: string;
  /** Solid color icon ring on the icon button (sidebar etc.). */
  ring: string;
}

export const SPACE_COLOR_ORDER = [
  "slate",
  "red",
  "orange",
  "amber",
  "emerald",
  "blue",
  "violet",
  "rose",
] as const satisfies readonly SpacePresetColor[];

export const SPACE_COLOR_TOKENS: Record<SpacePresetColor, SpaceColorTokens> = {
  slate: {
    bg: "bg-slate-500/12 dark:bg-slate-400/15",
    fg: "text-slate-700 dark:text-slate-200",
    dot: "bg-slate-500",
    ring: "ring-slate-500/30",
  },
  red: {
    bg: "bg-red-500/12 dark:bg-red-400/15",
    fg: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
    ring: "ring-red-500/30",
  },
  orange: {
    bg: "bg-orange-500/12 dark:bg-orange-400/15",
    fg: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
    ring: "ring-orange-500/30",
  },
  amber: {
    bg: "bg-amber-500/15 dark:bg-amber-400/15",
    fg: "text-amber-800 dark:text-amber-200",
    dot: "bg-amber-500",
    ring: "ring-amber-500/30",
  },
  emerald: {
    bg: "bg-emerald-500/12 dark:bg-emerald-400/15",
    fg: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/30",
  },
  blue: {
    bg: "bg-blue-500/12 dark:bg-blue-400/15",
    fg: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
    ring: "ring-blue-500/30",
  },
  violet: {
    bg: "bg-violet-500/12 dark:bg-violet-400/15",
    fg: "text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500",
    ring: "ring-violet-500/30",
  },
  rose: {
    bg: "bg-rose-500/12 dark:bg-rose-400/15",
    fg: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    ring: "ring-rose-500/30",
  },
};

export const SPACE_COLOR_LABEL: Record<SpacePresetColor, string> = {
  slate: "Slate",
  red: "Red",
  orange: "Orange",
  amber: "Amber",
  emerald: "Green",
  blue: "Blue",
  violet: "Violet",
  rose: "Rose",
};

export const DEFAULT_CUSTOM_HEX = "#6366f1";

export const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

export function isHexColor(value: string): boolean {
  return HEX_COLOR_REGEX.test(value);
}

export function isPresetColor(value: string): value is SpacePresetColor {
  return (SPACE_COLOR_ORDER as readonly string[]).includes(value);
}

export function normalizeHex(value: string): string {
  return value.toLowerCase();
}

/**
 * Inline style props for a custom hex color. The mixes target both light and
 * dark themes via `var(--foreground)`, which next-themes flips with the
 * `.dark` class — the foreground swing is enough to keep text readable on
 * either surface without needing a separate light/dark stylesheet.
 */
export interface HexColorStyles {
  bgStyle: CSSProperties;
  fgStyle: CSSProperties;
  dotStyle: CSSProperties;
  ringStyle: CSSProperties;
}

export function hexColorStyles(hex: string): HexColorStyles {
  const normalized = normalizeHex(hex);
  return {
    bgStyle: {
      backgroundColor: `color-mix(in oklab, ${normalized} 14%, transparent)`,
    },
    fgStyle: {
      color: `color-mix(in oklab, ${normalized} 82%, var(--foreground) 18%)`,
    },
    dotStyle: {
      backgroundColor: normalized,
    },
    ringStyle: {
      // boxShadow as a ring substitute so we can use color-mix output
      boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${normalized} 35%, transparent)`,
    },
  };
}

export type SpaceColorRender =
  | { kind: "preset"; tokens: SpaceColorTokens }
  | { kind: "hex"; styles: HexColorStyles };

/**
 * Dispatch helper for components that render with a space color. Always
 * returns something renderable — unknown strings fall back to `slate`.
 */
export function getSpaceColorRender(color: SpaceColor): SpaceColorRender {
  if (isPresetColor(color)) {
    return { kind: "preset", tokens: SPACE_COLOR_TOKENS[color] };
  }
  if (isHexColor(color)) {
    return { kind: "hex", styles: hexColorStyles(color) };
  }
  return { kind: "preset", tokens: SPACE_COLOR_TOKENS.slate };
}
