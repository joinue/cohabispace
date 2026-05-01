"use client";

import { useOptimistic, useTransition } from "react";
import { XIcon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import {
  completeTaskAction,
  deleteTaskAction,
  uncompleteTaskAction,
} from "@/features/tasks/actions";
import type { TaskWithRelations } from "@/features/tasks/queries";

export function SubtaskRow({ task }: { task: TaskWithRelations }) {
  const serverChecked = task.status === "completed";
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(serverChecked);
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  const toggle = (next: boolean) => {
    startTransition(async () => {
      setOptimisticChecked(next);
      if (next) await completeTaskAction(task.id);
      else await uncompleteTaskAction(task.id);
    });
  };

  const remove = () => {
    startDeleteTransition(async () => {
      await deleteTaskAction(task.id);
    });
  };

  const isComplete = optimisticChecked;

  return (
    <li
      className={cn(
        "group/subtask hover:bg-muted/40 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
        deletePending && "pointer-events-none opacity-50",
      )}
    >
      <Checkbox
        checked={isComplete}
        onCheckedChange={(v) => toggle(v === true)}
        disabled={pending}
        aria-label={isComplete ? `Reopen ${task.title}` : `Complete ${task.title}`}
      />
      <span
        className={cn(
          "flex-1 truncate text-sm",
          isComplete && "text-muted-foreground line-through",
        )}
      >
        {task.title}
      </span>
      <button
        type="button"
        onClick={remove}
        aria-label={`Delete ${task.title}`}
        className="text-muted-foreground hover:bg-muted hover:text-destructive rounded-md p-1 opacity-0 transition-opacity outline-none group-hover/subtask:opacity-100 focus-visible:opacity-100"
      >
        <XIcon className="size-3.5" aria-hidden="true" />
      </button>
    </li>
  );
}
