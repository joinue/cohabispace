import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/auth-card";
import { acceptInvitationAction } from "@/features/invitations/actions";
import { getCurrentUser } from "@/lib/dal";

export const metadata: Metadata = { title: "Accept invitation" };

const REASONS: Record<string, { title: string; body: string }> = {
  not_found: {
    title: "We couldn't find that invitation",
    body: "The link may be wrong, or the invitation has been deleted.",
  },
  expired: {
    title: "This invitation has expired",
    body: "Ask the person who invited you to send a fresh one.",
  },
  revoked: {
    title: "This invitation was revoked",
    body: "Reach out to whoever invited you to send a new invitation.",
  },
  already_accepted: {
    title: "This invitation has already been used",
    body: "Sign in to access the household.",
  },
  already_member: {
    title: "You're already in this household",
    body: "No action needed — head to your dashboard.",
  },
};

export default async function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const user = await getCurrentUser();

  if (!user) {
    const next = `/accept-invite/${encodeURIComponent(token)}`;
    return (
      <AuthCard
        title="Sign in to accept your invitation"
        description="Create an account or sign in with the email this invitation was sent to."
        footer={
          <Link
            href={`/sign-up?next=${encodeURIComponent(next)}` as Route}
            className="text-foreground underline-offset-4 hover:underline"
          >
            Don&rsquo;t have an account? Sign up
          </Link>
        }
      >
        <Link
          href={`/sign-in?next=${encodeURIComponent(next)}` as Route}
          className={buttonVariants({ size: "lg", className: "w-full" })}
        >
          Sign in
        </Link>
      </AuthCard>
    );
  }

  const result = await acceptInvitationAction(token);

  if (result.ok) {
    redirect("/dashboard" as Route);
  }

  const reason = REASONS[result.reason] ?? REASONS.not_found!;

  return (
    <AuthCard title={reason.title} description={reason.body}>
      <div className="flex flex-col gap-4">
        <div className="bg-muted/40 text-muted-foreground flex items-center justify-center rounded-xl border py-10">
          {result.reason === "already_member" ? (
            <CheckCircleIcon className="size-10" aria-hidden="true" />
          ) : (
            <XCircleIcon className="size-10" aria-hidden="true" />
          )}
        </div>
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "outline", className: "w-full" })}
        >
          Go to dashboard
        </Link>
      </div>
    </AuthCard>
  );
}
