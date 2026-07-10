import { useEffect, useState, type ReactNode } from "react";
import { api, type Contact, type Plan } from "../lib/api";
import { SiteDataContext, type SiteDataValue } from "./site-data-context";

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.getPlans(), api.getContact()])
      .then(([plansRes, contactRes]) => {
        if (cancelled) return;
        setPlans(plansRes);
        setContact(contactRes);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load site data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const value: SiteDataValue = {
    plans,
    contact,
    loading,
    error,
    refresh: () => {
      setLoading(true);
      setError(null);
      setVersion((v) => v + 1);
    },
  };

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}
