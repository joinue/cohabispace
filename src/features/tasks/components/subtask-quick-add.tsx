"use client";

import { startTransition, useActionState, useRef } from "react";
import { requestFormReset } from "react-dom";
import { PlusIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { createTaskAction } from "@/features/tasks/actions";
import type { FormState } from "@/lib/forms";

export function SubtaskQuickAdd({
  householdId,
  parentTaskId,
}: {
  householdId: string;
  parentTaskId: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const wrappedAction = async (prev: FormState, formData: FormData): Promise<FormState> => {
    const result = await createTaskAction(householdId, prev, formData);
    if (result && !result.error && !result.fieldErrors) {
      startTransition(() => {
        if (formRef.current) requestFormReset(formRef.current);
      });
    }
    return result;
  };

  const [state, formAction, pending] = useActionState(wrappedAction, undefined);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex items-center gap-2 rounded-md px-2 py-1.5"
    >
      <input type="hidden" name="parentTaskId" value={parentTaskId} />
      <PlusIcon className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
      <Input
        name="title"
        type="text"
        required
        maxLength={200}
        autoComplete="off"
        placeholder="Add subtask…"
        aria-label="New subtask"
        disabled={pending}
        className={cn(
          "h-7 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0",
          state?.error && "text-destructive",
        )}
      />
    </form>
  );
}
