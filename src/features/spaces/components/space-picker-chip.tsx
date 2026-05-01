"use client";

import { useState } from "react";
import { CheckIcon, FolderIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SpaceMark } from "@/features/spaces/components/space-mark";
import type { SpaceRow } from "@/features/spaces/queries";

export function SpacePickerChip({
  value,
  onChange,
  spaces,
  ariaLabel = "Pick a space",
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  spaces: SpaceRow[];
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = spaces.find((s) => s.id === value) ?? null;

  const select = (id: string | null) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={ariaLabel}
        className={cn(
          "border-input bg-background hover:bg-muted inline-flex h-8 items-center gap-1.5 rounded-full border px-2 text-xs font-medium transition-colors outline-none",
          "focus-visible:ring-ring/50 focus-visible:ring-2",
          selected ? "text-foreground pr-2.5" : "text-muted-foreground px-2.5",
        )}
      >
        {selected ? (
          <SpaceMark space={selected} size="xs" />
        ) : (
          <FolderIcon className="size-3.5" aria-hidden="true" />
        )}
        <span className="truncate">{selected ? selected.name : "Space"}</span>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="w-56 p-1">
        <button
          type="button"
          onClick={() => select(null)}
          className={cn(
            "hover:bg-muted flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none",
            "focus-visible:bg-muted",
          )}
        >
          <span className="text-muted-foreground flex items-center gap-2">
            <FolderIcon className="size-4" aria-hidden="true" />
            No space
          </span>
          {value === null ? <CheckIcon className="size-4" aria-hidden="true" /> : null}
        </button>
        {spaces.length > 0 ? <div className="bg-border my-1 h-px" /> : null}
        {spaces.map((s) => {
          const checked = s.id === value;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => select(s.id)}
              className={cn(
                "hover:bg-muted flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none",
                "focus-visible:bg-muted",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <SpaceMark space={s} size="sm" />
                <span className="truncate">{s.name}</span>
              </span>
              {checked ? <CheckIcon className="size-4 shrink-0" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
