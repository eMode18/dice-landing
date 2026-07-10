import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { api, clearStoredToken, type Plan } from "../../lib/api";
import { PlanCard } from "./PlanCard";
import { StatusPill } from "./StatusPill";
import { ChangePasswordCard } from "./ChangePasswordCard";

function blankPlan(): Plan {
  return {
    id: crypto.randomUUID(),
    name: "New Plan",
    price: "KSh 0",
    period: "/ day",
    description: "",
    features: [],
    icon: "bolt",
  };
}

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [contactStatus, setContactStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [savingContact, setSavingContact] = useState(false);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansStatus, setPlansStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [savingPlans, setSavingPlans] = useState(false);

  useEffect(() => {
    Promise.all([api.getPlans(), api.getContact()])
      .then(([plansRes, contactRes]) => {
        setPlans(plansRes);
        setPhone(contactRes.phone);
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "Failed to load data");
      })
      .finally(() => setLoading(false));
  }, []);

  function forceLogout(): void {
    clearStoredToken();
    onLogout();
  }

  function handleAuthError(err: unknown): boolean {
    if (err instanceof Error && err.message === "Unauthorized") {
      forceLogout();
      return true;
    }
    return false;
  }

  async function saveContact() {
    setSavingContact(true);
    setContactStatus(null);
    try {
      await api.updateContact(phone);
      setContactStatus({ ok: true, text: "Saved" });
    } catch (err) {
      if (!handleAuthError(err)) {
        setContactStatus({ ok: false, text: err instanceof Error ? err.message : "Failed to save" });
      }
    } finally {
      setSavingContact(false);
    }
  }

  async function savePlans() {
    setSavingPlans(true);
    setPlansStatus(null);
    try {
      const saved = await api.updatePlans(plans);
      setPlans(saved);
      setPlansStatus({ ok: true, text: "Saved" });
    } catch (err) {
      if (!handleAuthError(err)) {
        setPlansStatus({ ok: false, text: err instanceof Error ? err.message : "Failed to save" });
      }
    } finally {
      setSavingPlans(false);
    }
  }

  function updatePlan(id: string, patch: Partial<Plan>) {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removePlan(id: string) {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      // token may already be invalid — proceed with local logout regardless
    }
    clearStoredToken();
    onLogout();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dice-ash dark:bg-dice-ink">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-white/65">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <p className="text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dice-ash px-6 dark:bg-dice-ink">
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <Icon name="alert" className="h-5 w-5" />
          </span>
          <p className="text-sm text-slate-600 dark:text-white/60">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dice-ash dark:bg-dice-ink">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-dice-ink/70">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 sm:px-10">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Dice WiFi" className="h-8 w-auto dark:brightness-0 dark:invert" />
            <span className="rounded-full bg-dice-blue/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-dice-blue dark:bg-dice-cyan/10 dark:text-dice-cyan">
              Admin
            </span>
          </div>
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </header>

      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10 sm:px-10">
        {/* Contact number */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-white/10 dark:bg-white/5 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-dice-blue/10 text-dice-blue dark:bg-dice-cyan/10 dark:text-dice-cyan">
              <Icon name="headset" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-dice-ink dark:text-white">Contact Number</h2>
              <p className="text-sm text-slate-500 dark:text-white/65">Shown in the site footer.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-dice-ink outline-none transition-colors focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:ring-dice-cyan/25"
            />
            <Button type="button" onClick={saveContact} disabled={savingContact}>
              {savingContact ? "Saving…" : "Save"}
            </Button>
            {contactStatus && <StatusPill tone={contactStatus.ok ? "success" : "error"}>{contactStatus.text}</StatusPill>}
          </div>
        </section>

        {/* Plans */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-white/10 dark:bg-white/5 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-dice-blue/10 text-dice-blue dark:bg-dice-cyan/10 dark:text-dice-cyan">
                <Icon name="layers" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-dice-ink dark:text-white">Plans</h2>
                <p className="text-sm text-slate-500 dark:text-white/65">Powers the Plans section and the portal mockup.</p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPlans((prev) => [...prev, blankPlan()])}
              className="shrink-0"
            >
              <Icon name="plus" className="h-4 w-4" />
              Add Plan
            </Button>
          </div>

          <div className="flex flex-col gap-5">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onChange={(patch) => updatePlan(plan.id, patch)}
                onRemove={() => removePlan(plan.id)}
              />
            ))}

            {plans.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-600 dark:border-white/15 dark:text-white/65">
                No plans yet — add one to get started.
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button type="button" onClick={savePlans} disabled={savingPlans || plans.length === 0}>
              {savingPlans ? "Saving…" : "Save Plans"}
            </Button>
            {plansStatus && <StatusPill tone={plansStatus.ok ? "success" : "error"}>{plansStatus.text}</StatusPill>}
          </div>
        </section>

        <ChangePasswordCard onAuthError={forceLogout} />
      </div>
    </div>
  );
}
