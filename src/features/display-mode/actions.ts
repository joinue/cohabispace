"use server";

import { revalidatePath } from "next/cache";

import { writeFamilyDisplay } from "@/features/display-mode/cookie";

export async function setFamilyDisplayAction(enabled: boolean) {
  await writeFamilyDisplay(enabled);
  revalidatePath("/", "layout");
}
