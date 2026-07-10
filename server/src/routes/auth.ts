import { Router } from "express";
import {
  bearerToken,
  changePassword,
  login,
  logout,
  requestPasswordReset,
  requireAuth,
  resetPasswordWithCode,
} from "../auth.js";
import { sendPasswordResetEmail } from "../mailer.js";
import { rateLimit } from "../rateLimit.js";

export const authRouter = Router();

const MIN_PASSWORD_LENGTH = 6;

// Guards against brute-forcing the password/reset code, and against
// spamming the admin's inbox: N attempts per 15 minutes per IP, each on
// its own bucket.
const loginLimiter = rateLimit(10, 15 * 60 * 1000);
const requestResetLimiter = rateLimit(5, 15 * 60 * 1000);
const forgotPasswordLimiter = rateLimit(10, 15 * 60 * 1000);
const changePasswordLimiter = rateLimit(10, 15 * 60 * 1000);

authRouter.post("/login", loginLimiter, (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "username and password are required" });
    return;
  }

  const token = login(username, password);
  if (!token) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  res.json({ token });
});

authRouter.post("/logout", (req, res) => {
  const token = bearerToken(req);
  if (token) logout(token);
  res.status(204).end();
});

authRouter.post("/change-password", changePasswordLimiter, requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    newPassword.length < MIN_PASSWORD_LENGTH
  ) {
    res.status(400).json({ error: `newPassword must be at least ${MIN_PASSWORD_LENGTH} characters` });
    return;
  }

  const ok = changePassword(currentPassword, newPassword, bearerToken(req));
  if (!ok) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  res.status(204).end();
});

authRouter.post("/request-password-reset", requestResetLimiter, async (_req, res) => {
  // If ADMIN_EMAIL/SMTP aren't configured, sendPasswordResetEmail falls back
  // to logging the code to the console instead of failing outright — so
  // there's always a way in, even before you've set anything up.
  const code = requestPasswordReset();
  try {
    await sendPasswordResetEmail(code);
  } catch (err) {
    console.error("[auth] Failed to send password reset email:", err);
    res.status(502).json({ error: "Could not send the reset email. Try again shortly." });
    return;
  }

  res.status(204).end();
});

authRouter.post("/forgot-password", forgotPasswordLimiter, (req, res) => {
  const { code, newPassword } = req.body ?? {};
  if (
    typeof code !== "string" ||
    typeof newPassword !== "string" ||
    newPassword.length < MIN_PASSWORD_LENGTH
  ) {
    res.status(400).json({ error: `code and a newPassword of at least ${MIN_PASSWORD_LENGTH} characters are required` });
    return;
  }

  const ok = resetPasswordWithCode(code, newPassword);
  if (!ok) {
    res.status(401).json({ error: "Invalid or expired code" });
    return;
  }

  res.status(204).end();
});
