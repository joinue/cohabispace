import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set a new password"
      description="Pick something you'll remember on the next phone you forget your password on."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
