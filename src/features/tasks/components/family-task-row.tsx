"use client";

import { useOptimistic, useTransition } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { completeTaskAction, uncompleteTaskAction } from "@/features/tasks/actions";
import { SpacePill } from "@/features/spaces/components/space-pill";
import type { TaskWithRelations } from "@/features/tasks/queries";

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

/**
 * Ambient/kitchen-tablet task row. No kebab, no edit drawer — just a big
 * checkbox, big title, and a prominent assignee. To edit a task in this
 * mode, the user toggles Family Display off.
 */
export function FamilyTaskRow({ task }: { task: TaskWithRelations }) {
  const serverChecked = task.status === "completed";
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(serverChecked);
  const [pending, startTransition] = useTransition();

  const toggle = (next: boolean) => {
    startTransition(async () => {
      setOptimisticChecked(next);
      if (next) await completeTaskAction(task.id);
      else await uncompleteTaskAction(task.id);
    });
  };

  const isComplete = optimisticChecked;

  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors",
        "hover:bg-muted/40",
      )}
    >
      <Checkbox
        checked={isComplete}
        onCheckedChange={(v) => toggle(v === true)}
        disabled={pending}
        aria-label={isComplete ? `Mark "${task.title}" incomplete` : `Complete "${task.title}"`}
        className="size-6 [&>[data-slot=checkbox-indicator]>svg]:size-5"
      />
      <span className="flex min-w-0 flex-1 items-center gap-2.5">
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-lg sm:text-xl",
            isComplete && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </span>
        {task.space ? <SpacePill space={task.space} size="sm" /> : null}
      </span>
      {task.assignee ? (
        <Avatar size="lg">
          {task.assignee.avatar_url ? (
            <AvatarImage src={task.assignee.avatar_url} alt="" />
          ) : (
            <AvatarFallback className="text-sm font-medium">
              {initials(task.assignee.display_name, task.assignee.email)}
            </AvatarFallback>
          )}
        </Avatar>
      ) : null}
    </li>
  );
}
