import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

type PublicEnv = z.infer<typeof schema>;
let cache: PublicEnv | undefined;

function get(): PublicEnv {
  if (cache) return cache;
  const parsed = schema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Missing or invalid public environment variables. Copy .env.example to .env.local and fill in:\n${issues}`,
    );
  }
  cache = parsed.data;
  return cache;
}

/**
 * Lazy-validated public env. Reading any property triggers validation; just
 * importing the module does not. This keeps `next build`'s static analysis
 * pass from blowing up before secrets are configured.
 */
export const publicEnv = new Proxy({} as PublicEnv, {
  get(_t, prop) {
    return get()[prop as keyof PublicEnv];
  },
  has(_t, prop) {
    return prop in get();
  },
  ownKeys() {
    return Object.keys(get());
  },
  getOwnPropertyDescriptor(_t, prop) {
    return { configurable: true, enumerable: true, value: get()[prop as keyof PublicEnv] };
  },
});
