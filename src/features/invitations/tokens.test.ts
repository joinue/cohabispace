import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { generateInvitationToken, hashInvitationToken } from "./tokens";

describe("generateInvitationToken", () => {
  it("returns a base64url plaintext token (no `+`, `/`, or `=`)", () => {
    const { token } = generateInvitationToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("returns a hex SHA-256 hash that matches `hashInvitationToken(token)`", () => {
    const { token, tokenHash } = generateInvitationToken();
    expect(tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenHash).toBe(hashInvitationToken(token));
  });

  it("produces unique tokens across calls (overwhelmingly likely with 192 bits)", () => {
    const tokens = new Set(Array.from({ length: 32 }, () => generateInvitationToken().token));
    expect(tokens.size).toBe(32);
  });
});

describe("hashInvitationToken", () => {
  it("matches a manually computed SHA-256 hex digest", () => {
    const expected = createHash("sha256").update("known-token").digest("hex");
    expect(hashInvitationToken("known-token")).toBe(expected);
  });

  it("is deterministic for the same input", () => {
    expect(hashInvitationToken("abc")).toBe(hashInvitationToken("abc"));
  });

  it("returns different hashes for different inputs", () => {
    expect(hashInvitationToken("abc")).not.toBe(hashInvitationToken("abd"));
  });
});
