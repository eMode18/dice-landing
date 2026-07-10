import { Router } from "express";
import {
  bearerToken,
  changePassword,
  login,
  logout,
  requireAuth,
  resetPasswordWithRecoveryCode,
} from "../auth.js";
import { rateLimit } from "../rateLimit.js";

export const authRouter = Router();

const MIN_PASSWORD_LENGTH = 6;

// Guards against brute-forcing the password or the recovery code: 10
// attempts per 15 minutes per IP, each on its own bucket.
const loginLimiter = rateLimit(10, 15 * 60 * 1000);
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

authRouter.post("/forgot-password", forgotPasswordLimiter, (req, res) => {
  const { recoveryCode, newPassword } = req.body ?? {};
  if (
    typeof recoveryCode !== "string" ||
    typeof newPassword !== "string" ||
    newPassword.length < MIN_PASSWORD_LENGTH
  ) {
    res.status(400).json({ error: `recoveryCode and a newPassword of at least ${MIN_PASSWORD_LENGTH} characters are required` });
    return;
  }

  const ok = resetPasswordWithRecoveryCode(recoveryCode, newPassword);
  if (!ok) {
    res.status(401).json({ error: "Invalid recovery code" });
    return;
  }

  res.status(204).end();
});
