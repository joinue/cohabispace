import "server-only";

import { cookies } from "next/headers";

const COOKIE_NAME = "cohabispace.active_household";
const ONE_YEAR_S = 60 * 60 * 24 * 365;

export async function readActiveHouseholdId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function writeActiveHouseholdId(id: string | null) {
  const store = await cookies();
  if (id) {
    store.set(COOKIE_NAME, id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_S,
      path: "/",
    });
  } else {
    store.delete(COOKIE_NAME);
  }
}
