"use client";

import { useState } from "react";
import { CheckIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { HouseholdMember } from "@/features/households/queries";

function initials(name: string | null, email: string): string {
  const source = (name?.trim() || email).trim();
  if (!source) return "?";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .toUpperCase();
}

export function AssigneePickerChip({
  value,
  onChange,
  members,
  ariaLabel = "Assign to a member",
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  members: HouseholdMember[];
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = members.find((m) => m.userId === value) ?? null;

  const select = (id: string | null) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={ariaLabel}
        className={cn(
          "border-input bg-background hover:bg-muted inline-flex h-8 items-center gap-1.5 rounded-full border px-2 text-xs font-medium transition-colors outline-none pointer-coarse:h-10 pointer-coarse:text-sm",
          "focus-visible:ring-ring/50 focus-visible:ring-2",
          selected ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {selected ? (
          <Avatar size="sm" className="size-5">
            {selected.avatarUrl ? (
              <AvatarImage src={selected.avatarUrl} alt="" />
            ) : (
              <AvatarFallback className="text-[10px]">
                {initials(selected.displayName, selected.email)}
              </AvatarFallback>
            )}
          </Avatar>
        ) : (
          <UserIcon className="size-3.5" aria-hidden="true" />
        )}
        <span className="pr-1.5">
          {selected ? (selected.displayName ?? selected.email.split("@")[0]) : "Anyone"}
        </span>
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
            <UserIcon className="size-4" aria-hidden="true" />
            Unassigned
          </span>
          {value === null ? <CheckIcon className="size-4" aria-hidden="true" /> : null}
        </button>
        <div className="bg-border my-1 h-px" />
        {members.map((m) => {
          const checked = m.userId === value;
          return (
            <button
              key={m.userId}
              type="button"
              onClick={() => select(m.userId)}
              className={cn(
                "hover:bg-muted flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none",
                "focus-visible:bg-muted",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Avatar size="sm" className="size-5">
                  {m.avatarUrl ? (
                    <AvatarImage src={m.avatarUrl} alt="" />
                  ) : (
                    <AvatarFallback className="text-[10px]">
                      {initials(m.displayName, m.email)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="truncate">{m.displayName ?? m.email.split("@")[0]}</span>
              </span>
              {checked ? <CheckIcon className="size-4 shrink-0" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
