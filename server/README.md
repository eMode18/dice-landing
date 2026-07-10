# Dice backend

Minimal Express + TypeScript API for the Dice WiFi site. Storage is
in-memory only — all data resets to the seed values whenever the process
restarts.

## Setup

```bash
cd server
npm install
cp .env.example .env   # then edit ADMIN_USERNAME / ADMIN_PASSWORD
npm run dev
```

Runs on `http://localhost:4000` by default.

## Endpoints

| Method | Path              | Auth | Description                          |
|--------|-------------------|------|---------------------------------------|
| GET    | `/api/health`     | none | Liveness check                        |
| GET    | `/api/plans`      | none | List all plans                        |
| PUT    | `/api/plans`      | yes  | Replace the entire plans array        |
| GET    | `/api/contact`    | none | Get the contact phone number          |
| PUT    | `/api/contact`    | yes  | Update the contact phone number       |
| POST   | `/api/auth/login`           | none | `{ username, password }` → `{ token }`                          |
| POST   | `/api/auth/logout`          | yes  | Invalidate the current token                                    |
| POST   | `/api/auth/change-password` | yes  | `{ currentPassword, newPassword }` — also logs out other sessions |
| POST   | `/api/auth/forgot-password` | none | `{ recoveryCode, newPassword }` — logs out every session         |

Authenticated requests send `Authorization: Bearer <token>`. Tokens live
in memory and expire after 12 hours or on server restart.

`login`, `change-password`, and `forgot-password` are rate-limited to 10
requests per 15 minutes per IP (429 once exceeded) to slow down brute-force
guessing of the password or recovery code.

Password changes (via either endpoint) only live in memory too — a server
restart reverts the admin password back to `ADMIN_PASSWORD` from `.env`.

The `web/` frontend's `/admin` page is the intended way to use the write
endpoints day-to-day; the table above is for scripting or debugging directly.

## Forgot password

If you're locked out, the server console prints a recovery code on startup
(unless you've set `ADMIN_RECOVERY_CODE` yourself):

```
[auth] ADMIN_RECOVERY_CODE is not set — generated one for this run: xxxxxxxxxxxxxxxx
```

Use that code on the `/admin` login page's "Forgot password?" link to set a
new password.
