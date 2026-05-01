import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UsersIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveHousehold, getMyHouseholds } from "@/features/households/queries";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const households = await getMyHouseholds();
  if (households.length === 0) {
    redirect("/households/new" as Route);
  }

  const active = await getActiveHousehold();
  const isAdmin = active?.role === "owner" || active?.role === "admin";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{active?.name}</h1>
          <p className="text-muted-foreground text-sm">
            The household, tasks, and reminders surfaces are next on the build list.
          </p>
        </div>
        {active ? (
          <Link
            href={`/households/${active.id}/members` as Route}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <UsersIcon aria-hidden="true" />
            Members
          </Link>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phase 1 — what works in this build</CardTitle>
          <CardDescription>
            You can sign up, sign in, create a household, and invite people.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            <li>Email + password auth (sign-up, sign-in, password reset)</li>
            <li>Multi-household membership with a switcher in the top bar</li>
            <li>
              Members page —{" "}
              {isAdmin ? "invite, revoke, and manage roles" : "see who's part of this household"}
            </li>
            <li>RLS-backed schema for profiles, households, members, invitations</li>
            <li>Modern UI: shadcn (Base UI) + custom theme tokens, dark/light/system</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
