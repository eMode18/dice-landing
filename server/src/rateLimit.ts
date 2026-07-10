import type { NextFunction, Request, Response } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

/** Simple in-memory fixed-window limiter, keyed by IP. Good enough for a
    single-process, no-DB backend guarding brute-forceable auth endpoints.
    Note: if this ever runs behind a reverse proxy, set Express's
    `trust proxy` so req.ip reflects the real client instead of the proxy
    (otherwise every request shares one bucket). */
export function rateLimit(limit: number, windowMs: number) {
  const buckets = new Map<string, Bucket>();

  return function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
    const now = Date.now();
    const key = req.ip ?? "unknown";
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    bucket.count += 1;
    if (bucket.count > limit) {
      res.status(429).json({ error: "Too many attempts. Try again later." });
      return;
    }
    next();
  };
}
