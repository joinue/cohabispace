"use client";

import { useActionState, useState, useTransition } from "react";
import { TrashIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { FormFieldError } from "@/features/auth/components/form-field-error";
import { deleteTaskAction, updateTaskAction } from "@/features/tasks/actions";
import { AssigneePickerChip } from "@/features/tasks/components/assignee-picker-chip";
import { DatePickerChip } from "@/features/tasks/components/date-picker-chip";
import { RecurrencePickerChip } from "@/features/tasks/components/recurrence-picker-chip";
import { SpacePickerChip } from "@/features/spaces/components/space-picker-chip";
import type { HouseholdMember } from "@/features/households/queries";
import type { SpaceRow } from "@/features/spaces/queries";
import type { FormState } from "@/lib/forms";
import type { TaskWithRelations } from "@/features/tasks/queries";

export function EditTaskSheet({
  task,
  members,
  spaces,
  open,
  onOpenChange,
}: {
  task: TaskWithRelations;
  members: HouseholdMember[];
  spaces: SpaceRow[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <EditTaskFormBody
          /* Re-mount on open so initial state matches the latest task. */
          key={open ? `${task.id}-${task.updated_at}` : "closed"}
          task={task}
          members={members}
          spaces={spaces}
          onClose={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}

function EditTaskFormBody({
  task,
  members,
  spaces,
  onClose,
}: {
  task: TaskWithRelations;
  members: HouseholdMember[];
  spaces: SpaceRow[];
  onClose: () => void;
}) {
  const [date, setDate] = useState<Date | null>(task.due_at ? new Date(task.due_at) : null);
  const [assignee, setAssignee] = useState<string | null>(task.assigned_to);
  const [spaceId, setSpaceId] = useState<string | null>(task.space_id);
  const [rrule, setRrule] = useState<string | null>(task.rrule);
  const [deletePending, startDelete] = useTransition();

  const handleRrule = (next: string | null) => {
    if (next && !date) {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      setDate(today);
    }
    setRrule(next);
  };

  const wrappedAction = async (prev: FormState, formData: FormData): Promise<FormState> => {
    const result = await updateTaskAction(task.id, prev, formData);
    if (result && !result.error && !result.fieldErrors) onClose();
    return result;
  };

  const [state, formAction, pending] = useActionState(wrappedAction, undefined);

  const remove = () => {
    startDelete(async () => {
      await deleteTaskAction(task.id);
      onClose();
    });
  };

  return (
    <>
      <SheetHeader className="flex flex-col gap-1 border-b px-5 py-4">
        <SheetTitle className="text-base font-semibold tracking-tight">Edit task</SheetTitle>
        <SheetDescription className="text-muted-foreground text-xs">
          Changes save when you click Save.
        </SheetDescription>
      </SheetHeader>

      <form
        id="edit-task-form"
        action={formAction}
        className="flex flex-1 flex-col gap-5 overflow-y-auto p-5"
      >
        <input type="hidden" name="dueAt" value={date ? date.toISOString() : ""} />
        <input type="hidden" name="assignedTo" value={assignee ?? ""} />
        <input type="hidden" name="spaceId" value={spaceId ?? ""} />
        <input type="hidden" name="rrule" value={rrule ?? ""} />

        {state?.error ? (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={task.title}
            aria-invalid={Boolean(state?.fieldErrors?.title)}
          />
          <FormFieldError messages={state?.fieldErrors?.title} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-notes">Notes</Label>
          <textarea
            id="edit-notes"
            name="notes"
            rows={4}
            maxLength={2000}
            defaultValue={task.notes ?? ""}
            placeholder="Optional details, links, supplies needed…"
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 w-full resize-y rounded-lg border bg-transparent px-2.5 py-2 text-sm transition-colors outline-none focus-visible:ring-3 disabled:opacity-50 aria-invalid:ring-3"
            aria-invalid={Boolean(state?.fieldErrors?.notes)}
          />
          <FormFieldError messages={state?.fieldErrors?.notes} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>When</Label>
          <div className="flex flex-wrap gap-1.5">
            <DatePickerChip value={date} onChange={setDate} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Assigned to</Label>
          <div className="flex flex-wrap gap-1.5">
            <AssigneePickerChip value={assignee} onChange={setAssignee} members={members} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Space</Label>
          <div className="flex flex-wrap gap-1.5">
            <SpacePickerChip value={spaceId} onChange={setSpaceId} spaces={spaces} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Repeat</Label>
          <div className="flex flex-wrap gap-1.5">
            <RecurrencePickerChip value={rrule} anchor={date} onChange={handleRrule} />
          </div>
        </div>
      </form>

      <SheetFooter className="flex flex-row items-center justify-between gap-2 border-t px-5 py-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={remove}
          disabled={deletePending || pending}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <TrashIcon aria-hidden="true" />
          Delete
        </Button>
        <div className="flex items-center gap-2">
          <SheetClose
            render={
              <Button type="button" variant="ghost" size="sm">
                Cancel
              </Button>
            }
          />
          <Button type="submit" form="edit-task-form" size="sm" disabled={pending || deletePending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </SheetFooter>
    </>
  );
}
