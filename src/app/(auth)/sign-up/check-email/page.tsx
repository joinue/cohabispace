import type { Metadata } from "next";
import Link from "next/link";
import { MailCheckIcon } from "lucide-react";

import { AuthCard } from "@/features/auth/components/auth-card";

export const metadata: Metadata = { title: "Check your email" };

export default function CheckEmailPage() {
  return (
    <AuthCard
      title="Check your inbox"
      description="We sent you a confirmation link. Click it to finish setting up your account."
      footer={
        <>
          Wrong email?{" "}
          <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
            Try again
          </Link>
        </>
      }
    >
      <div className="bg-muted/40 text-muted-foreground flex items-center justify-center rounded-xl border py-10">
        <MailCheckIcon className="size-10" aria-hidden="true" />
      </div>
    </AuthCard>
  );
}
