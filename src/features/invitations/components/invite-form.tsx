"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormFieldError } from "@/features/auth/components/form-field-error";
import { createInvitationAction } from "@/features/invitations/actions";
import type { InviteRole } from "@/features/invitations/schemas";

const ROLES: { value: InviteRole; label: string; hint: string }[] = [
  { value: "admin", label: "Admin", hint: "Manages members and settings" },
  { value: "adult", label: "Adult", hint: "Full access to tasks and reminders" },
  { value: "teen", label: "Teen", hint: "Can be assigned tasks" },
  { value: "child", label: "Child", hint: "Limited access" },
  { value: "guest", label: "Guest", hint: "Temporary read-only access" },
];

export function InviteForm({ householdId }: { householdId: string }) {
  const action = createInvitationAction.bind(null, householdId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const lastResultRef = useRef<typeof state>(undefined);

  useEffect(() => {
    if (state === lastResultRef.current) return;
    lastResultRef.current = state;
    if (state && !state.error && !state.fieldErrors) {
      toast.success("Invitation sent.");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4" noValidate>
      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="them@example.com"
            aria-invalid={Boolean(state?.fieldErrors?.email)}
          />
          <FormFieldError messages={state?.fieldErrors?.email} />
        </div>

        <div className="flex flex-col gap-1.5 sm:w-40">
          <Label htmlFor="invite-role">Role</Label>
          <Select name="role" defaultValue="adult">
            <SelectTrigger id="invite-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={pending} className="sm:w-auto">
          {pending ? "Sending…" : "Send invite"}
        </Button>
      </div>
    </form>
  );
}
