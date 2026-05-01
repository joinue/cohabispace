import "server-only";

import { getResend } from "@/lib/resend/client";
import { serverEnv } from "@/lib/env/server";
import { publicEnv } from "@/lib/env/client";
import { InvitationEmail } from "@/lib/email/templates/invitation";

const EXPIRES_IN_DAYS = 7;

export interface SendInvitationEmailInput {
  to: string;
  inviterName: string;
  householdName: string;
  token: string;
}

export async function sendInvitationEmail({
  to,
  inviterName,
  householdName,
  token,
}: SendInvitationEmailInput) {
  const acceptUrl = `${publicEnv.NEXT_PUBLIC_APP_URL}/accept-invite/${token}`;

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: serverEnv.RESEND_FROM_EMAIL,
    to,
    subject: `You're invited to ${householdName} on Cohabispace`,
    react: InvitationEmail({
      inviterName,
      householdName,
      acceptUrl,
      expiresInDays: EXPIRES_IN_DAYS,
    }),
  });

  if (error) throw new Error(`Resend: ${error.message}`);
}

export const INVITATION_EXPIRES_IN_DAYS = EXPIRES_IN_DAYS;
