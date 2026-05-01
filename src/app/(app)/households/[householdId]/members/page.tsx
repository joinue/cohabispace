import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/dal";
import { getHouseholdMembers, getMyHouseholds } from "@/features/households/queries";
import { MembersList } from "@/features/households/components/members-list";
import { InviteForm } from "@/features/invitations/components/invite-form";
import { PendingInvitationsList } from "@/features/invitations/components/pending-list";
import { getPendingInvitations } from "@/features/invitations/queries";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage({
  params,
}: {
  params: Promise<{ householdId: string }>;
}) {
  const { householdId } = await params;
  const user = await requireUser();

  const myHouseholds = await getMyHouseholds();
  const household = myHouseholds.find((h) => h.id === householdId);
  if (!household) notFound();

  const isAdmin = household.role === "owner" || household.role === "admin";
  const [members, pendingInvitations] = await Promise.all([
    getHouseholdMembers(householdId),
    isAdmin ? getPendingInvitations(householdId) : Promise.resolve([]),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
          {household.name}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Members</h1>
        <p className="text-muted-foreground text-sm">
          {isAdmin
            ? "Invite people, see who's in, and manage who can do what."
            : "Everyone who's part of this household."}
        </p>
      </div>

      {isAdmin ? (
        <Card>
          <CardHeader>
            <CardTitle>Invite someone</CardTitle>
            <CardDescription>
              They&rsquo;ll get an email with a link that expires in 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteForm householdId={householdId} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>People</CardTitle>
          <CardDescription>
            {members.length === 1 ? "Just you so far." : `${members.length} members.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MembersList members={members} currentUserId={user.id} />
        </CardContent>
      </Card>

      {isAdmin && pendingInvitations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Pending invitations</CardTitle>
            <CardDescription>
              Sent but not accepted yet. Revoke any that you didn&rsquo;t mean to send.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PendingInvitationsList invitations={pendingInvitations} householdId={householdId} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
