"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { requestFormReset } from "react-dom";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { FormFieldError } from "@/features/auth/components/form-field-error";
import { createSpaceAction } from "@/features/spaces/actions";
import { SPACE_COLOR_LABEL, SPACE_COLOR_ORDER, SPACE_COLOR_TOKENS } from "@/features/spaces/colors";
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

      <FormFieldError messages={state?.fieldErrors?.name} />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-muted-foreground mr-1 text-xs">Color</span>
        {SPACE_COLOR_ORDER.map((c) => {
          const tokens = SPACE_COLOR_TOKENS[c];
          const selected = c === color;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={SPACE_COLOR_LABEL[c]}
              aria-pressed={selected}
              className={cn(
                "size-6 rounded-full transition-shadow outline-none",
                tokens.dot,
                selected
                  ? "ring-foreground ring-offset-background ring-2 ring-offset-2"
                  : "ring-foreground/10 hover:ring-foreground/30 ring-1",
              )}
            />
          );
        })}
      </div>
    </form>
  );
}
