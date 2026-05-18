import "server-only";

import { cookies } from "next/headers";

const COOKIE_NAME = "cohabispace.family_display";
const ONE_YEAR_S = 60 * 60 * 24 * 365;

/**
 * Whether the current device is in Family Display (ambient kitchen-tablet)
 * mode. Stored per-device in a cookie so a mounted tablet stays in family
 * mode while the user's phone stays normal.
 */
export async function readFamilyDisplay(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "1";
}

export async function writeFamilyDisplay(enabled: boolean) {
  const store = await cookies();
  if (enabled) {
    store.set(COOKIE_NAME, "1", {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_S,
      path: "/",
    });
  } else {
    store.delete(COOKIE_NAME);
  }
}
