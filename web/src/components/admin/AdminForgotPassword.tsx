import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { api } from "../../lib/api";

const fieldClass =
  "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-dice-ink outline-none transition-colors focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:ring-dice-cyan/25";

type Stage = "request" | "code" | "success";

export function AdminForgotPassword({ onBack }: { onBack: () => void }) {
  const [stage, setStage] = useState<Stage>("request");

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function requestCode() {
    setError(null);
    setRequesting(true);
    try {
      await api.requestPasswordReset();
      setStage("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code");
    } finally {
      setRequesting(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setSubmitting(true);
    try {
      await api.forgotPassword(code, newPassword);
      setStage("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === "success") {
    return (
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-white/5">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <h1 className="font-display mb-1 text-xl font-semibold text-dice-ink dark:text-white">Password reset</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-white/65">
          Your password has been changed. Sign in with your new password.
        </p>
        <Button type="button" size="lg" className="w-full justify-center" onClick={onBack}>
          Back to Sign In
        </Button>
      </div>
    );
  }

  if (stage === "request") {
    return (
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/5">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-dice-blue text-white shadow-[0_10px_26px_-8px_rgba(0,102,255,0.6)]">
          <Icon name="headset" className="h-5 w-5" />
        </span>

        <h1 className="font-display mb-1 text-2xl font-semibold text-dice-ink dark:text-white">Reset Password</h1>
        <p className="mb-7 text-sm text-slate-500 dark:text-white/65">
          We'll email a one-time code to the admin address configured on the server.
        </p>

        {error && (
          <p className="mb-4 flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400">
            <Icon name="alert" className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <Button type="button" size="lg" className="w-full justify-center" onClick={requestCode} disabled={requesting}>
          {requesting ? "Sending…" : "Send Reset Code"}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="mt-4 w-full text-center text-sm font-medium text-slate-500 hover:text-dice-blue dark:text-white/65 dark:hover:text-dice-cyan"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/5"
    >
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-dice-blue text-white shadow-[0_10px_26px_-8px_rgba(0,102,255,0.6)]">
        <Icon name="shield" className="h-5 w-5" />
      </span>

      <h1 className="font-display mb-1 text-2xl font-semibold text-dice-ink dark:text-white">Check your email</h1>
      <p className="mb-7 text-sm text-slate-500 dark:text-white/65">
        Enter the 6-digit code we sent, plus a new password. It expires in 15 minutes.
      </p>

      <label className="mb-4 block text-sm">
        <span className="mb-1.5 block font-medium text-dice-ink dark:text-white">Reset code</span>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={fieldClass}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          required
        />
      </label>

      <label className="mb-4 block text-sm">
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

      <label className="mb-2 block text-sm">
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

      {error && (
        <p className="mb-1 mt-3 flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400">
          <Icon name="alert" className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-5 w-full justify-center" disabled={submitting}>
        {submitting ? "Resetting…" : "Reset Password"}
      </Button>

      <button
        type="button"
        onClick={requestCode}
        disabled={requesting}
        className="mt-4 w-full text-center text-sm font-medium text-slate-500 hover:text-dice-blue disabled:opacity-50 dark:text-white/65 dark:hover:text-dice-cyan"
      >
        {requesting ? "Resending…" : "Resend code"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="mt-2 w-full text-center text-sm font-medium text-slate-500 hover:text-dice-blue dark:text-white/65 dark:hover:text-dice-cyan"
      >
        Back to Sign In
      </button>
    </form>
  );
}
