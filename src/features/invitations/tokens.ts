import "server-only";

import { createHash, randomBytes } from "node:crypto";

/**
 * Generate a fresh URL-safe invitation token. 24 bytes of randomness ≈
 * 192 bits, base64url-encoded to ~32 chars. The plaintext is sent via
 * email; only the SHA-256 hash is stored in the database.
 */
export function generateInvitationToken(): { token: string; tokenHash: string } {
  const token = randomBytes(24).toString("base64url");
  const tokenHash = hashInvitationToken(token);
  return { token, tokenHash };
}

export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
