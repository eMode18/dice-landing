# Dice backend

Minimal Express + TypeScript API for the Dice WiFi site. Storage is
in-memory only — all data resets to the seed values whenever the process
restarts.

## Setup

```bash
cd server
npm install
cp .env.example .env   # then edit ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_EMAIL / SMTP_*
npm run dev
```

Runs on `http://localhost:4000` by default.

## Endpoints

| Method | Path                          | Auth | Description                                                        |
|--------|-------------------------------|------|----------------------------------------------------------------------|
| GET    | `/api/health`                  | none | Liveness check                                                      |
| GET    | `/api/plans`                   | none | List all plans                                                      |
| PUT    | `/api/plans`                   | yes  | Replace the entire plans array                                     |
| GET    | `/api/contact`                 | none | Get the contact phone number                                       |
| PUT    | `/api/contact`                 | yes  | Update the contact phone number                                    |
| POST   | `/api/auth/login`               | none | `{ username, password }` → `{ token }`                              |
| POST   | `/api/auth/logout`              | yes  | Invalidate the current token                                        |
| POST   | `/api/auth/change-password`     | yes  | `{ currentPassword, newPassword }` — also logs out other sessions   |
| POST   | `/api/auth/request-password-reset` | none | Emails a 6-digit code to `ADMIN_EMAIL`, valid for 15 minutes     |
| POST   | `/api/auth/forgot-password`     | none | `{ code, newPassword }` — logs out every session                    |

Authenticated requests send `Authorization: Bearer <token>`. Tokens live
in memory and expire after 12 hours or on server restart.

`login`, `request-password-reset`, `forgot-password`, and `change-password`
are all rate-limited per IP (429 once exceeded) to slow down brute-forcing
the password or the reset code, and to stop the reset endpoint from being
used to spam the admin's inbox.

Password changes (via either endpoint) only live in memory too — a server
restart reverts the admin password back to `ADMIN_PASSWORD` from `.env`.

The `web/` frontend's `/admin` page is the intended way to use the write
endpoints day-to-day; the table above is for scripting or debugging directly.

## Forgot password

Clicking "Forgot password?" on `/admin` requests a one-time 6-digit code
that's emailed to `ADMIN_EMAIL`. Set that plus SMTP credentials in `.env`:

```
ADMIN_EMAIL=you@example.com
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=Dice WiFi <no-reply@yourdomain.com>
```

Any SMTP provider works (Gmail with an app password, SendGrid, Mailgun,
Resend, AWS SES, ...). If SMTP isn't configured, the code is printed to the
server console instead — fine for local dev, not for a real deployment.

The code expires after 15 minutes and can only be used once.
