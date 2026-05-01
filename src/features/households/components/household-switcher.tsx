"use client";

import { useTransition } from "react";
import Link from "next/link";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { setActiveHouseholdAction } from "@/features/households/actions";
import type { HouseholdWithRole } from "@/features/households/queries";

export function HouseholdSwitcher({
  households,
  activeId,
}: {
  households: HouseholdWithRole[];
  activeId: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const active = households.find((h) => h.id === activeId) ?? households[0];

  if (!active) return null;

  const select = (id: string) => {
    if (id === active.id) return;
    startTransition(async () => {
      await setActiveHouseholdAction(id);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "hover:bg-muted/60 group inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-medium tracking-tight transition-colors outline-none",
          "focus-visible:bg-muted/60 focus-visible:ring-ring/50 focus-visible:ring-2",
          pending && "opacity-50",
        )}
      >
        <span className="max-w-[14ch] truncate">{active.name}</span>
        <ChevronsUpDownIcon className="text-muted-foreground size-3.5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6} className="min-w-56">
        <DropdownMenuLabel>Households</DropdownMenuLabel>
        {households.map((h) => (
          <DropdownMenuItem
            key={h.id}
            onClick={() => select(h.id)}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex flex-col">
              <span className="truncate text-sm">{h.name}</span>
              <span className="text-muted-foreground text-xs capitalize">{h.role}</span>
            </span>
            {h.id === active.id ? (
              <CheckIcon className="size-4 shrink-0" aria-hidden="true" />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/households/new" className="flex items-center gap-1.5">
              <PlusIcon className="size-4" aria-hidden="true" />
              <span>New household</span>
            </Link>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
