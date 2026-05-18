"use client";

import { useState } from "react";
import { CheckIcon, RepeatIcon, XIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  type RecurrencePresetId,
  RECURRENCE_PRESETS,
  buildPresetRule,
  describeRule,
  matchPreset,
} from "@/features/tasks/recurrence";

export function RecurrencePickerChip({
  value,
  anchor,
  onChange,
  ariaLabel = "Set repeat",
}: {
  /** RRULE string, or null for one-off. */
  value: string | null;
  /** Due date used to anchor presets (weekly/monthly). */
  anchor: Date | null;
  onChange: (next: string | null) => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const currentPreset = matchPreset(value);
  const summary = describeRule(value);

  const select = (preset: RecurrencePresetId) => {
    onChange(buildPresetRule(preset, anchor));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={ariaLabel}
        className={cn(
          "border-input bg-background hover:bg-muted inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors outline-none pointer-coarse:h-10 pointer-coarse:text-sm",
          "focus-visible:ring-ring/50 focus-visible:ring-2",
          value ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <RepeatIcon className="size-3.5" aria-hidden="true" />
        <span className="max-w-[18ch] truncate">{summary ?? "Repeat"}</span>
        {value ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Stop repeating"
            className="hover:text-destructive -mr-1 ml-1 rounded-full p-0.5"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
              }
            }}
          >
            <XIcon className="size-3" aria-hidden="true" />
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="w-64 p-1">
        {RECURRENCE_PRESETS.map((p) => {
          const checked = p.id === currentPreset;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p.id)}
              className={cn(
                "hover:bg-muted flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none",
                "focus-visible:bg-muted",
              )}
            >
              <span className="flex flex-col">
                <span>{p.label}</span>
                <span className="text-muted-foreground text-xs">{p.preview(anchor)}</span>
              </span>
              {checked ? <CheckIcon className="size-4 shrink-0" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
