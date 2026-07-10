import { createHash, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/** Constant-time string comparison (via fixed-length digests, so
    timingSafeEqual's equal-length requirement is met regardless of the
    inputs' own lengths) — avoids leaking password/recovery-code length or
    contents through response-time differences. */
function safeEqual(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
let adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const RESET_CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes

if (!process.env.ADMIN_PASSWORD) {
  console.warn(
    "[auth] ADMIN_PASSWORD is not set — using the insecure default. Set it in server/.env before deploying."
  );
}

const tokens = new Map<string, number>(); // token -> expiry epoch ms

let pendingReset: { code: string; expiresAt: number } | null = null;

function pruneExpired(): void {
  const now = Date.now();
  for (const [token, expiresAt] of tokens) {
    if (expiresAt <= now) tokens.delete(token);
  }
}

export function login(username: string, password: string): string | null {
  if (username !== ADMIN_USERNAME || !safeEqual(password, adminPassword)) return null;
  const token = randomUUID();
  tokens.set(token, Date.now() + TOKEN_TTL_MS);
  return token;
}

export function logout(token: string): void {
  tokens.delete(token);
}

/** Verifies the current password and swaps in the new one, keeping only the
    session that made the request alive (every other token is invalidated). */
export function changePassword(currentPassword: string, newPassword: string, currentToken: string): boolean {
  if (!safeEqual(currentPassword, adminPassword)) return false;
  adminPassword = newPassword;
  for (const token of tokens.keys()) {
    if (token !== currentToken) tokens.delete(token);
  }
  return true;
}

/** Generates a fresh 6-digit reset code, valid for 15 minutes, replacing
    any code requested earlier. The caller is responsible for emailing it. */
export function requestPasswordReset(): string {
  const code = String(randomInt(100000, 1000000));
  pendingReset = { code, expiresAt: Date.now() + RESET_CODE_TTL_MS };
  return code;
}

/** Email-delivered reset code path for a lost password — single-use, expires
    after 15 minutes, and logs out every session since whoever used this
    didn't have a valid one to begin with. */
export function resetPasswordWithCode(code: string, newPassword: string): boolean {
  if (!pendingReset || pendingReset.expiresAt <= Date.now()) return false;
  if (!safeEqual(code, pendingReset.code)) return false;
  pendingReset = null;
  adminPassword = newPassword;
  tokens.clear();
  return true;
}

export function bearerToken(req: Request): string {
  const header = req.header("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  pruneExpired();
  const token = bearerToken(req);
  if (!token || !tokens.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
