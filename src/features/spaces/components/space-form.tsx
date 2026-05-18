"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { requestFormReset } from "react-dom";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FormFieldError } from "@/features/auth/components/form-field-error";
import { createSpaceAction } from "@/features/spaces/actions";
import { SpaceColorPicker } from "@/features/spaces/components/space-color-picker";
import type { SpaceColor } from "@/lib/supabase/database.types";
import type { FormState } from "@/lib/forms";

export function CreateSpaceForm({ householdId }: { householdId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [color, setColor] = useState<SpaceColor>("slate");

  const wrappedAction = async (prev: FormState, formData: FormData): Promise<FormState> => {
    const result = await createSpaceAction(householdId, prev, formData);
    if (result && !result.error && !result.fieldErrors) {
      startTransition(() => {
        if (formRef.current) requestFormReset(formRef.current);
        setColor("slate");
      });
    }
    return result;
  };

  const [state, formAction, pending] = useActionState(wrappedAction, undefined);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3" noValidate>
      <input type="hidden" name="color" value={color} />

      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex items-end gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="space-name" className="text-xs">
            Name
          </Label>
          <Input
            id="space-name"
            name="name"
            type="text"
            required
            maxLength={60}
            placeholder="e.g., Garage"
            className="h-9"
            aria-invalid={Boolean(state?.fieldErrors?.name)}
          />
        </div>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Adding…" : "Add space"}
        </Button>
      </div>

      <FormFieldError messages={state?.fieldErrors?.color} />
      <FormFieldError messages={state?.fieldErrors?.name} />

      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs">Color</span>
        <SpaceColorPicker value={color} onChange={setColor} />
      </div>
    </form>
  );
}
