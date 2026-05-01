"use client";

import { useOptimistic, useState, useTransition } from "react";
import { ListTreeIcon, MoreHorizontalIcon, PencilIcon, RepeatIcon, TrashIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
  completeTaskAction,
  deleteTaskAction,
  uncompleteTaskAction,
} from "@/features/tasks/actions";
import { EditTaskSheet } from "@/features/tasks/components/edit-task-sheet";
import { classifyDue, formatDueDate } from "@/features/tasks/utils";
import { SpacePill } from "@/features/spaces/components/space-pill";
import type { HouseholdMember } from "@/features/households/queries";
import type { SpaceRow } from "@/features/spaces/queries";
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

const DUE_TONE: Record<string, string> = {
  overdue: "text-destructive",
  today: "text-foreground",
  tomorrow: "text-muted-foreground",
  thisWeek: "text-muted-foreground",
  later: "text-muted-foreground",
  noDate: "text-muted-foreground",
};

export function TaskRow({
  task,
  members,
  spaces,
  subtasks = [],
  showSpacePill = true,
}: {
  task: TaskWithRelations;
  members: HouseholdMember[];
  spaces: SpaceRow[];
  subtasks?: TaskWithRelations[];
  /** When viewing a single space, hide the per-row pill (it's redundant). */
  showSpacePill?: boolean;
}) {
  const serverChecked = task.status === "completed";
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(serverChecked);
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

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

  const dueLabel = formatDueDate(task.due_at);
  const dueTone = DUE_TONE[classifyDue(task.due_at)] ?? "text-muted-foreground";
  const isComplete = optimisticChecked;
  const subtaskTotal = subtasks.length;
  const subtaskDone = subtasks.filter((s) => s.status === "completed").length;

  return (
    <>
      <li
        className={cn(
          "group/task hover:bg-muted/40 flex items-center gap-3 rounded-md px-2 py-2 transition-colors",
          deletePending && "pointer-events-none opacity-50",
        )}
      >
        <Checkbox
          checked={isComplete}
          onCheckedChange={(v) => toggle(v === true)}
          disabled={pending}
          aria-label={isComplete ? `Mark "${task.title}" incomplete` : `Complete "${task.title}"`}
        />
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 text-left outline-none",
            "focus-visible:ring-ring/50 rounded-sm focus-visible:ring-2",
          )}
        >
          <span
            className={cn(
              "flex min-w-0 flex-1 items-center gap-1.5 text-sm",
              isComplete && "text-muted-foreground line-through",
            )}
          >
            <span className="truncate">{task.title}</span>
            {task.rrule ? (
              <RepeatIcon className="text-muted-foreground size-3 shrink-0" aria-label="Repeats" />
            ) : null}
            {subtaskTotal > 0 ? (
              <span
                className="text-muted-foreground inline-flex shrink-0 items-center gap-0.5 text-[11px] tabular-nums"
                aria-label={`${subtaskDone} of ${subtaskTotal} subtasks done`}
              >
                <ListTreeIcon className="size-3" aria-hidden="true" />
                {subtaskDone}/{subtaskTotal}
              </span>
            ) : null}
          </span>
          {showSpacePill && task.space ? <SpacePill space={task.space} size="xs" /> : null}
          {dueLabel ? (
            <span className={cn("shrink-0 text-xs tabular-nums", dueTone)}>{dueLabel}</span>
          ) : null}
          {task.assignee ? (
            <Avatar size="sm" className="size-5">
              {task.assignee.avatar_url ? (
                <AvatarImage src={task.assignee.avatar_url} alt="" />
              ) : (
                <AvatarFallback className="text-[10px]">
                  {initials(task.assignee.display_name, task.assignee.email)}
                </AvatarFallback>
              )}
            </Avatar>
          ) : null}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${task.title}`}
            className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-md p-1 opacity-0 transition-opacity outline-none group-hover/task:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100"
          >
            <MoreHorizontalIcon className="size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            <DropdownMenuItem
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5"
            >
              <PencilIcon className="size-4" aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={remove}
              variant="destructive"
              className="flex items-center gap-1.5"
            >
              <TrashIcon className="size-4" aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
      <EditTaskSheet
        task={task}
        members={members}
        spaces={spaces}
        subtasks={subtasks}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
