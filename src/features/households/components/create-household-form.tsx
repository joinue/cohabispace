"use client";

import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createHouseholdAction } from "@/features/households/actions";
import { FormFieldError } from "@/features/auth/components/form-field-error";

export function CreateHouseholdForm({
  submitLabel = "Create household",
}: {
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(createHouseholdAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Household name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          maxLength={80}
          required
          autoFocus
          placeholder="The Salernos"
          aria-invalid={Boolean(state?.fieldErrors?.name)}
        />
        <FormFieldError messages={state?.fieldErrors?.name} />
        <p className="text-muted-foreground text-xs">
          You can rename this any time. It&rsquo;s just what you&rsquo;ll call this household inside
          the app.
        </p>
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Creating…" : submitLabel}
      </Button>
    </form>
  );
}
