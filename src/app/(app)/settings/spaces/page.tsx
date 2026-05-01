import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveHousehold, getMyHouseholds } from "@/features/households/queries";
import { CreateSpaceForm } from "@/features/spaces/components/space-form";
import { SpaceRow } from "@/features/spaces/components/space-row";
import { getActiveSpaces, getArchivedSpaces } from "@/features/spaces/queries";

export const metadata: Metadata = { title: "Manage spaces" };

export default async function SpacesSettingsPage() {
  const households = await getMyHouseholds();
  if (households.length === 0) redirect("/households/new" as Route);

  const active = await getActiveHousehold();
  if (!active) redirect("/households/new" as Route);

  const isAdmin = active.role === "owner" || active.role === "admin";
  const isAdult = isAdmin || active.role === "adult";

  const [spaces, archived] = await Promise.all([
    getActiveSpaces(active.id),
    getArchivedSpaces(active.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
          Settings
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Spaces</h1>
        <p className="text-muted-foreground text-sm">
          Spaces are how you organize tasks — rooms, themes, or projects. Tasks live in one space
          (or none).
        </p>
      </div>

      {isAdult ? (
        <Card>
          <CardHeader>
            <CardTitle>New space</CardTitle>
            <CardDescription>Pick an emoji, a name, and a color.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateSpaceForm householdId={active.id} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Active</CardTitle>
          <CardDescription>
            {spaces.length === 0
              ? "No active spaces yet."
              : `${spaces.length} ${spaces.length === 1 ? "space" : "spaces"} in this household.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {spaces.length > 0 ? (
            <ul className="flex flex-col">
              {spaces.map((s) => (
                <SpaceRow key={s.id} space={s} isAdmin={isAdmin} />
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>

      {archived.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Archived</CardTitle>
            <CardDescription>Restore to bring them back into the sidebar.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col">
              {archived.map((s) => (
                <SpaceRow key={s.id} space={s} isAdmin={isAdmin} archived />
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
