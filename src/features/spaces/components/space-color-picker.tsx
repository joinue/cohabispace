"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import {
  DEFAULT_CUSTOM_HEX,
  HEX_COLOR_REGEX,
  SPACE_COLOR_LABEL,
  SPACE_COLOR_ORDER,
  SPACE_COLOR_TOKENS,
  hexColorStyles,
  isHexColor,
  normalizeHex,
} from "@/features/spaces/colors";
import type { SpaceColor } from "@/lib/supabase/database.types";

/**
 * Swatch row used by both the create form and the edit drawer. Preset dots
 * plus a "custom" tile that opens the native color picker and a hex input
 * for typing a value directly.
 */
export function SpaceColorPicker({
  value,
  onChange,
  swatchSize = 6,
}: {
  value: SpaceColor;
  onChange: (next: SpaceColor) => void;
  /** Tailwind size step, e.g. `6` → `size-6`. Defaults to 6 (matches create form). */
  swatchSize?: 6 | 7;
}) {
  const colorInputId = useId();
  const hexInputId = useId();

  const valueIsHex = isHexColor(value);
  const [customHex, setCustomHex] = useState<string>(
    valueIsHex ? normalizeHex(value) : DEFAULT_CUSTOM_HEX,
  );
  const [hexDraft, setHexDraft] = useState<string>(valueIsHex ? normalizeHex(value) : "");

  const customSelected = valueIsHex;
  const customStyles = hexColorStyles(valueIsHex ? value : customHex);

  const sizeClass = swatchSize === 7 ? "size-7" : "size-6";

  const pickCustom = (next: string) => {
    const normalized = normalizeHex(next);
    setCustomHex(normalized);
    setHexDraft(normalized);
    onChange(normalized);
  };

  const onHexInputChange = (raw: string) => {
    // Always keep what the user typed in the visible field; only commit when valid.
    const withHash = raw.startsWith("#") ? raw : raw ? `#${raw}` : "";
    setHexDraft(withHash);
    if (HEX_COLOR_REGEX.test(withHash)) pickCustom(withHash);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {SPACE_COLOR_ORDER.map((c) => {
          const tokens = SPACE_COLOR_TOKENS[c];
          const selected = !valueIsHex && c === value;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-label={SPACE_COLOR_LABEL[c]}
              aria-pressed={selected}
              className={cn(
                sizeClass,
                "rounded-full transition-shadow outline-none",
                tokens.dot,
                selected
                  ? "ring-foreground ring-offset-background ring-2 ring-offset-2"
                  : "ring-foreground/10 hover:ring-foreground/30 ring-1",
              )}
            />
          );
        })}

        <label
          htmlFor={colorInputId}
          aria-label="Custom color"
          aria-pressed={customSelected}
          className={cn(
            sizeClass,
            "relative grid cursor-pointer place-items-center rounded-full transition-shadow outline-none",
            customSelected
              ? "ring-foreground ring-offset-background ring-2 ring-offset-2"
              : "ring-foreground/10 hover:ring-foreground/30 ring-1",
          )}
          style={customSelected ? customStyles.dotStyle : undefined}
        >
          {/* Rainbow ring hint when no custom color is active yet */}
          {!customSelected ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 180deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
              }}
            />
          ) : null}
          <input
            id={colorInputId}
            type="color"
            value={customHex}
            onChange={(e) => pickCustom(e.target.value)}
            onInput={(e) => pickCustom((e.target as HTMLInputElement).value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor={hexInputId}
          className="text-muted-foreground font-mono text-[11px] tracking-wide uppercase"
        >
          Hex
        </label>
        <input
          id={hexInputId}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="#4a90e2"
          maxLength={7}
          value={hexDraft}
          onChange={(e) => onHexInputChange(e.target.value)}
          className={cn(
            "border-input bg-background placeholder:text-muted-foreground/60 h-7 w-24 rounded-md border px-2 font-mono text-xs tracking-wide outline-none",
            "focus-visible:ring-ring/50 focus-visible:ring-2",
          )}
        />
      </div>
    </div>
  );
}
