"use client";

import { useActionState, useRef, useState } from "react";
import { requestFormReset } from "react-dom";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FormFieldError } from "@/features/auth/components/form-field-error";
import { createTaskAction } from "@/features/tasks/actions";
import { AssigneePickerChip } from "@/features/tasks/components/assignee-picker-chip";
import { DatePickerChip } from "@/features/tasks/components/date-picker-chip";
import { SpacePickerChip } from "@/features/spaces/components/space-picker-chip";
import type { HouseholdMember } from "@/features/households/queries";
import type { SpaceRow } from "@/features/spaces/queries";
import type { FormState } from "@/lib/forms";

export function QuickAddTask({
  householdId,
  members,
  spaces,
  defaultSpaceId = null,
}: {
  householdId: string;
  members: HouseholdMember[];
  spaces: SpaceRow[];
  defaultSpaceId?: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [assignee, setAssignee] = useState<string | null>(null);
  const [spaceId, setSpaceId] = useState<string | null>(defaultSpaceId);

  const wrappedAction = async (prev: FormState, formData: FormData): Promise<FormState> => {
    const result = await createTaskAction(householdId, prev, formData);
    if (result && !result.error && !result.fieldErrors) {
      if (formRef.current) requestFormReset(formRef.current);
      setDate(null);
      setAssignee(null);
      setSpaceId(defaultSpaceId);
    }
    return result;
  };

  const [state, formAction, pending] = useActionState(wrappedAction, undefined);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2.5" noValidate>
      <input type="hidden" name="dueAt" value={date ? date.toISOString() : ""} />
      <input type="hidden" name="assignedTo" value={assignee ?? ""} />
      <input type="hidden" name="spaceId" value={spaceId ?? ""} />

      <div className="flex items-center gap-2">
        <Input
          name="title"
          type="text"
          required
          maxLength={200}
          autoComplete="off"
          placeholder="Add a task…"
          aria-invalid={Boolean(state?.fieldErrors?.title)}
          aria-label="New task title"
          className="h-9"
        />
        <Button type="submit" size="sm" disabled={pending}>
          <PlusIcon aria-hidden="true" />
          {pending ? "Adding…" : "Add"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <DatePickerChip value={date} onChange={setDate} />
        <AssigneePickerChip value={assignee} onChange={setAssignee} members={members} />
        <SpacePickerChip value={spaceId} onChange={setSpaceId} spaces={spaces} />
      </div>

      <FormFieldError messages={state?.fieldErrors?.title} />
      {state?.error ? <p className="text-destructive text-xs">{state.error}</p> : null}
    </form>
  );
}
