import { Router } from "express";
import { requireAuth } from "../auth.js";
import { store, type Plan } from "../store.js";

export const plansRouter = Router();

function isValidPlan(value: unknown): value is Plan {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    p.id.trim().length > 0 &&
    typeof p.name === "string" &&
    p.name.trim().length > 0 &&
    typeof p.price === "string" &&
    typeof p.period === "string" &&
    typeof p.description === "string" &&
    Array.isArray(p.features) &&
    p.features.every((f) => typeof f === "string") &&
    typeof p.icon === "string" &&
    (p.popular === undefined || typeof p.popular === "boolean")
  );
}

plansRouter.get("/", (_req, res) => {
  res.json(store.getPlans());
});

plansRouter.put("/", requireAuth, (req, res) => {
  const body = req.body;
  if (!Array.isArray(body) || body.length === 0 || !body.every(isValidPlan)) {
    res.status(400).json({ error: "Body must be a non-empty array of valid plans" });
    return;
  }

  const ids = new Set(body.map((plan) => plan.id));
  if (ids.size !== body.length) {
    res.status(400).json({ error: "Plan ids must be unique" });
    return;
  }

  store.setPlans(body);
  res.json(store.getPlans());
});
