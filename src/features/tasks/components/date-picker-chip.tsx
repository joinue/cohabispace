"use client";

import { useState } from "react";
import { addDays, nextMonday, nextSaturday, format, isToday, isTomorrow } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function setNoon(d: Date) {
  const out = new Date(d);
  out.setHours(12, 0, 0, 0);
  return out;
}

function labelFor(d: Date): string {
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "MMM d");
}

const PRESETS = [
  { label: "Today", build: () => setNoon(new Date()) },
  { label: "Tomorrow", build: () => setNoon(addDays(new Date(), 1)) },
  { label: "This weekend", build: () => setNoon(nextSaturday(new Date())) },
  { label: "Next week", build: () => setNoon(nextMonday(new Date())) },
];

export function DatePickerChip({
  value,
  onChange,
  ariaLabel = "Set due date",
}: {
  value: Date | null;
  onChange: (next: Date | null) => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  const select = (d: Date | undefined) => {
    if (!d) return;
    onChange(setNoon(d));
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
        <CalendarIcon className="size-3.5" aria-hidden="true" />
        <span>{value ? labelFor(value) : "Date"}</span>
        {value ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date"
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
      <PopoverContent align="start" className="w-auto p-0" sideOffset={6}>
        <div className="flex flex-col gap-0.5 p-1.5">
          {PRESETS.map((p) => (
            <Button
              key={p.label}
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => select(p.build())}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <Separator />
        <Calendar mode="single" selected={value ?? undefined} onSelect={select} className="p-2" />
      </PopoverContent>
    </Popover>
  );
}
