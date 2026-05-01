import "server-only";

import { z } from "zod";

const SCHEMAS = {
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(3),
} as const;

type ServerEnv = { [K in keyof typeof SCHEMAS]: string };
type ServerEnvKey = keyof typeof SCHEMAS;

const cache = new Map<ServerEnvKey, string>();

function getEnv(key: ServerEnvKey): string {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const parsed = SCHEMAS[key].safeParse(process.env[key]);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "invalid";
    throw new Error(
      `Missing or invalid environment variable ${key}: ${message}. Set it in .env.local.`,
    );
  }
  cache.set(key, parsed.data);
  return parsed.data;
}

/**
 * Lazy, per-property server env. Accessing one variable only validates that
 * one — so a missing RESEND_API_KEY won't break a flow that needs only the
 * Supabase service-role key, and vice versa.
 */
export const serverEnv = new Proxy({} as ServerEnv, {
  get(_t, prop) {
    return getEnv(prop as ServerEnvKey);
  },
  has(_t, prop) {
    return prop in SCHEMAS;
  },
  ownKeys() {
    return Object.keys(SCHEMAS);
  },
  getOwnPropertyDescriptor(_t, prop) {
    if (!(prop in SCHEMAS)) return undefined;
    return { configurable: true, enumerable: true, value: getEnv(prop as ServerEnvKey) };
  },
});
