import type { ReactNode } from "react";
import { Icon } from "../ui/Icon";
import { iconNames, toIconName } from "../ui/icons";
import type { Plan } from "../../lib/api";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-dice-ink outline-none transition-colors focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:ring-dice-cyan/25";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-sm">
      <span className="mb-1.5 block font-medium text-dice-ink dark:text-white">{label}</span>
      {children}
    </label>
  );
}

export function PlanCard({
  plan,
  onChange,
  onRemove,
}: {
  plan: Plan;
  onChange: (patch: Partial<Plan>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10">
      {/* Header — mirrors how the plan actually reads on the live site */}
      <div className="flex items-center gap-3 bg-slate-50 px-5 py-4 dark:bg-white/5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dice-blue text-white shadow-[0_8px_20px_-8px_rgba(0,102,255,0.6)]">
          <Icon name={toIconName(plan.icon, "bolt")} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-dice-ink dark:text-white">
            {plan.name || "Untitled plan"}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-white/65">
            {plan.price} {plan.period}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChange({ popular: !plan.popular })}
          className={`hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:inline-flex ${
            plan.popular
              ? "bg-dice-blue text-white"
              : "border border-slate-300 text-slate-500 hover:border-dice-blue/40 hover:text-dice-blue dark:border-white/15 dark:text-white/65"
          }`}
        >
          <Icon name="star" className="h-3.5 w-3.5" />
          Popular
        </button>

        <button
          type="button"
          onClick={onRemove}
          aria-label="Delete plan"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-white/50"
        >
          <Icon name="trash" className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile-only popular toggle (hidden above, header gets tight on small widths) */}
      <button
        type="button"
        onClick={() => onChange({ popular: !plan.popular })}
        className={`flex w-full items-center justify-center gap-1.5 border-b border-slate-200/80 py-2 text-xs font-semibold sm:hidden dark:border-white/10 ${
          plan.popular ? "bg-dice-blue text-white" : "text-slate-500 dark:text-white/65"
        }`}
      >
        <Icon name="star" className="h-3.5 w-3.5" />
        {plan.popular ? "Marked as Most Popular" : "Mark as Most Popular"}
      </button>

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <Field label="Name">
          <input value={plan.name} onChange={(e) => onChange({ name: e.target.value })} className={inputClass} />
        </Field>

        <Field label="Price">
          <input value={plan.price} onChange={(e) => onChange({ price: e.target.value })} className={inputClass} />
        </Field>

        <Field label="Period">
          <input
            value={plan.period}
            onChange={(e) => onChange({ period: e.target.value })}
            placeholder="/ day"
            className={inputClass}
          />
        </Field>

        <Field label="Icon">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dice-blue/10 text-dice-blue dark:bg-dice-cyan/10 dark:text-dice-cyan">
              <Icon name={toIconName(plan.icon, "bolt")} className="h-4 w-4" />
            </span>
            <select
              value={plan.icon}
              onChange={(e) => onChange({ icon: e.target.value })}
              className={inputClass}
            >
              {iconNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              value={plan.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={2}
              className={`resize-none ${inputClass}`}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Features (one per line)">
            <textarea
              value={plan.features.join("\n")}
              onChange={(e) =>
                onChange({ features: e.target.value.split("\n").map((f) => f.trim()).filter(Boolean) })
              }
              rows={3}
              className={`resize-none ${inputClass}`}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
