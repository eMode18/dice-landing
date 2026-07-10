import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { api } from "../../lib/api";
import { StatusPill } from "./StatusPill";

const fieldClass =
  "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-dice-ink outline-none transition-colors focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:ring-dice-cyan/25";

export function ChangePasswordCard({ onAuthError }: { onAuthError: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ ok: false, text: "New passwords don't match" });
      return;
    }

    setSubmitting(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setStatus({ ok: true, text: "Password changed" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        onAuthError();
        return;
      }
      setStatus({ ok: false, text: err instanceof Error ? err.message : "Failed to change password" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-white/10 dark:bg-white/5 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-dice-blue/10 text-dice-blue dark:bg-dice-cyan/10 dark:text-dice-cyan">
          <Icon name="shield" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-dice-ink dark:text-white">Password</h2>
          <p className="text-sm text-slate-500 dark:text-white/65">Change the admin login password.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1.5 block font-medium text-dice-ink dark:text-white">Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={fieldClass}
              autoComplete="current-password"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-1.5 block font-medium text-dice-ink dark:text-white">New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={fieldClass}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-1.5 block font-medium text-dice-ink dark:text-white">Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldClass}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Change Password"}
          </Button>
          {status && <StatusPill tone={status.ok ? "success" : "error"}>{status.text}</StatusPill>}
        </div>
      </form>
    </section>
  );
}
