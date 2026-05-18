"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signUpAction } from "@/features/auth/actions";
import { FormFieldError } from "@/features/auth/components/form-field-error";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="displayName">Your name</Label>
        <Input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          required
          placeholder="Jane Salerno"
          aria-invalid={Boolean(state?.fieldErrors?.displayName)}
        />
        <FormFieldError messages={state?.fieldErrors?.displayName} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-invalid={Boolean(state?.fieldErrors?.email)}
        />
        <FormFieldError messages={state?.fieldErrors?.email} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          aria-invalid={Boolean(state?.fieldErrors?.password)}
        />
        <FormFieldError messages={state?.fieldErrors?.password} />
        <p className="text-muted-foreground text-xs">At least 8 characters.</p>
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-muted-foreground text-center text-xs leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-foreground underline-offset-4 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-foreground underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
