"use client";

import { useTransition } from "react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { revokeInvitationAction } from "@/features/invitations/actions";
import type { PendingInvitation } from "@/features/invitations/queries";

function formatExpires(expiresAt: string) {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "expired";
  const days = Math.round(ms / (24 * 60 * 60 * 1000));
  if (days < 1) return "expires today";
  if (days === 1) return "expires tomorrow";
  return `expires in ${days} days`;
}

export function PendingInvitationsList({
  invitations,
  householdId,
}: {
  invitations: PendingInvitation[];
  householdId: string;
}) {
  const [pending, startTransition] = useTransition();

  if (invitations.length === 0) return null;

  const revoke = (id: string, email: string) => {
    startTransition(async () => {
      await revokeInvitationAction(id, householdId);
      toast.success(`Revoked invite for ${email}.`);
    });
  };

  return (
    <ul className="flex flex-col">
      {invitations.map((inv) => (
        <li
          key={inv.id}
          className="hover:bg-muted/40 flex items-center justify-between gap-3 rounded-md px-2 py-2"
        >
          <div className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm">{inv.email}</span>
            <span className="text-muted-foreground text-xs">{formatExpires(inv.expiresAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {inv.role}
            </Badge>
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              onClick={() => revoke(inv.id, inv.email)}
              disabled={pending}
              aria-label={`Revoke invite for ${inv.email}`}
            >
              <XIcon aria-hidden="true" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
