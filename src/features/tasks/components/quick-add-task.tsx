"use client";

import { useActionState, useEffect, useRef } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FormFieldError } from "@/features/auth/components/form-field-error";
import { createTaskAction } from "@/features/tasks/actions";

export function QuickAddTask({ householdId }: { householdId: string }) {
  const action = createTaskAction.bind(null, householdId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const lastResultRef = useRef<typeof state>(undefined);

  useEffect(() => {
    if (state === lastResultRef.current) return;
    lastResultRef.current = state;
    if (state && !state.error && !state.fieldErrors) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-1.5" noValidate>
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
      <FormFieldError messages={state?.fieldErrors?.title} />
      {state?.error ? <p className="text-destructive text-xs">{state.error}</p> : null}
    </form>
  );
}
