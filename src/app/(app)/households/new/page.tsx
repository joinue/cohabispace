import type { Metadata } from "next";

import { CreateHouseholdForm } from "@/features/households/components/create-household-form";
import { getMyHouseholds } from "@/features/households/queries";

export const metadata: Metadata = { title: "New household" };

export default async function NewHouseholdPage() {
  const households = await getMyHouseholds();
  const isFirst = households.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 pt-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">
          {isFirst ? "Create your first household" : "New household"}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {isFirst
            ? "A household is a shared space for chores, projects, and reminders. You can invite others later."
            : "Each household is its own space. You'll be able to switch between them from the top bar."}
        </p>
      </div>

      <CreateHouseholdForm submitLabel={isFirst ? "Create household" : "Create"} />
    </div>
  );
}
