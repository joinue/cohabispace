import type { ZodIssue } from "zod";

/**
 * Standard return shape for `useActionState`-driven Server Actions.
 *
 * On success the action redirects, so the type is the *failure* shape.
 * Top-level form errors live on `error`; per-field issues live on
 * `fieldErrors` and are keyed by the form's input name.
 */
export type FormState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
    }
  | undefined;

export function fieldErrorsFromZod(issues: readonly ZodIssue[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path.join(".");
    if (!key) continue;
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
