"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type FormState, fieldErrorsFromZod } from "@/lib/forms";
import { publicEnv } from "@/lib/env/client";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/features/auth/schemas";

const callbackPath = "/api/auth/callback";

function safeNext(value: FormDataEntryValue | null): Route {
  if (typeof value !== "string") return "/dashboard" as Route;
  // Only allow same-site relative paths to prevent open-redirect.
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard" as Route;
  return value as Route;
}

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Email or password is incorrect." };

  redirect(safeNext(formData.get("next")));
}

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}${callbackPath}`,
      data: { display_name: parsed.data.displayName },
    },
  });
  if (error) return { error: error.message };

  redirect(`/sign-up/check-email?email=${encodeURIComponent(parsed.data.email)}` as Route);
}

export async function forgotPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const supabase = await createSupabaseServerClient();
  // Always respond as if the email was sent — don't leak whether the address
  // is registered.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}${callbackPath}?next=/reset-password`,
  });

  redirect(`/forgot-password/check-email?email=${encodeURIComponent(parsed.data.email)}` as Route);
}

export async function resetPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  redirect("/dashboard" as Route);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  // Read the request origin so this works regardless of host.
  // (Useful when running on preview deploys.)
  await headers();
  redirect("/sign-in" as Route);
}
