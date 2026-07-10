import "dotenv/config";
import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { contactRouter } from "./routes/contact.js";
import { plansRouter } from "./routes/plans.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "dice-server",
    message: "This is the Dice WiFi API — the site itself runs separately (the web/ Vite app).",
    endpoints: ["/api/health", "/api/plans", "/api/contact", "/api/auth/login", "/api/auth/logout"],
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/plans", plansRouter);
app.use("/api/contact", contactRouter);

app.listen(PORT, () => {
  console.log(`Dice backend listening on http://localhost:${PORT}`);
});
