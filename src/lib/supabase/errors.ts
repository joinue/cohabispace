import "server-only";

import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Wrap a PostgREST error in a real `Error` so it stringifies usefully in
 * the Next.js dev overlay, server logs, and toast messages.
 *
 * Codes that indicate a missing migration get a hint pointing at the
 * fix, since this is the most common cause early in development.
 */
export class QueryError extends Error {
  override readonly name = "QueryError";
  readonly code: string | undefined;
  readonly hint: string | null;
  readonly details: string | null;
  readonly context: string;

  constructor(context: string, cause: PostgrestError) {
    const isMissingSchema = cause.code === "42P01" || cause.code === "42703";
    const migrationHint = isMissingSchema
      ? " (looks like a missing migration — run `npx supabase db push` or paste the latest SQL into the dashboard SQL editor)"
      : "";
    const hintSuffix = cause.hint ? ` — ${cause.hint}` : "";

    super(`${context}: ${cause.message}${hintSuffix}${migrationHint}`);

    this.context = context;
    this.code = cause.code ?? undefined;
    this.hint = cause.hint ?? null;
    this.details = cause.details ?? null;
  }
}

/** Convenience: throw a typed `QueryError` from a PostgREST result. */
export function throwQueryError(error: PostgrestError, context: string): never {
  throw new QueryError(context, error);
}
