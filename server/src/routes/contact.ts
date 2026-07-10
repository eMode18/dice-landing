import { Router } from "express";
import { requireAuth } from "../auth.js";
import { store } from "../store.js";

export const contactRouter = Router();

contactRouter.get("/", (_req, res) => {
  res.json(store.getContact());
});

contactRouter.put("/", requireAuth, (req, res) => {
  const { phone } = req.body ?? {};
  if (typeof phone !== "string" || phone.trim().length === 0) {
    res.status(400).json({ error: "phone must be a non-empty string" });
    return;
  }

  store.setContact({ phone: phone.trim() });
  res.json(store.getContact());
});
