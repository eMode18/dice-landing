import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { api, setStoredToken } from "../../lib/api";
import { AdminForgotPassword } from "./AdminForgotPassword";

const fieldClass =
  "w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3.5 text-sm text-dice-ink outline-none transition-colors focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:ring-dice-cyan/25";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { token } = await api.login(username, password);
      setStoredToken(token);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dice-ash px-6 dark:bg-dice-ink">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dice-blue/15 blur-[110px] dark:bg-dice-cyan/10" />

      {mode === "reset" ? (
        <AdminForgotPassword onBack={() => setMode("login")} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/5"
        >
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-dice-blue text-white shadow-[0_10px_26px_-8px_rgba(0,102,255,0.6)]">
            <Icon name="lock" className="h-5 w-5" />
          </span>

          <h1 className="font-display mb-1 text-2xl font-semibold text-dice-ink dark:text-white">Dice Admin</h1>
          <p className="mb-7 text-sm text-slate-500 dark:text-white/65">
            Sign in to manage plans and contact info.
          </p>

          <label className="mb-4 block text-sm">
            <span className="mb-1.5 block font-medium text-dice-ink dark:text-white">Username</span>
            <div className="relative">
              <Icon
                name="user"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-white/50"
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={fieldClass}
                autoComplete="username"
                autoFocus
                required
              />
            </div>
          </label>

          <label className="mb-2 block text-sm">
            <span className="mb-1.5 block font-medium text-dice-ink dark:text-white">Password</span>
            <div className="relative">
              <Icon
                name="lock"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-white/50"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setMode("reset")}
              className="text-sm font-medium text-slate-500 hover:text-dice-blue dark:text-white/65 dark:hover:text-dice-cyan"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="mb-1 mt-3 flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400">
              <Icon name="alert" className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-5 w-full justify-center" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      )}
    </div>
  );
}
