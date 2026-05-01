import "server-only";

import { Resend } from "resend";

import { serverEnv } from "@/lib/env/server";

let cached: Resend | undefined;

/**
 * Lazy Resend singleton. Construction is deferred so the module imports
 * cleanly during Next's static analysis pass before keys are configured.
 */
export function getResend(): Resend {
  if (!cached) cached = new Resend(serverEnv.RESEND_API_KEY);
  return cached;
}
