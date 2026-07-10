import type { ReactNode } from "react";
import { Icon } from "../ui/Icon";

type Tone = "success" | "error";

const styles: Record<Tone, string> = {
  success:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
  error: "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400",
};

export function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${styles[tone]}`}>
      <Icon name={tone === "success" ? "check" : "alert"} className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}
