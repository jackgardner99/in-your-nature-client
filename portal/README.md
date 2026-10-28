# In Your Nature — Client Portal

Vite + React + TypeScript, routed with React Router. Lives inside the main site's repo and is served at
**getinyournature.com/portal/**.

```sh
cd portal
npm install
npm run dev        # http://localhost:5173/portal/
```

## Deploying

There is no separate deploy. The main site's GitHub Action (`.github/workflows/deploy.yml`) builds the
portal with base `/portal/`, copies `portal/dist` into the site's `dist/portal`, and writes a `404.html`
that forwards unknown `/portal/...` paths (e.g. invite links) to the portal, which restores the URL.

GitHub Pages can't proxy `/api`, so in production the portal calls the backend directly. Set the
repository variable **`PORTAL_API_URL`** (e.g. `https://api.getinyournature.com`) under
Settings → Secrets and variables → Actions → Variables. The backend must then:

- allow CORS from `https://getinyournature.com` with `Access-Control-Allow-Credentials: true`
  (an explicit origin, not `*`), for GET, POST, PUT, PATCH and the `Content-Type` header;
- set the session cookie as `HttpOnly; Secure; SameSite=Lax`. The API on a subdomain of the same
  domain counts as same-site, so the cookie is sent;
- build email links under `/portal/`: `https://getinyournature.com/portal/invite/<token>` and
  `https://getinyournature.com/portal/reset-password/<token>`.

## Layout

- `src/index.css` — design tokens (colors, fonts, radii, shadows) and base styles
- `src/components/` — Layout (sidebar shell), ui (Card, Button, ButtonLink, Chip, Progress), DarkBanner, NextStepCheck, LoadState
- `src/pages/` — one component per route: Home, Blueprint (`/blueprint/:facetId?`), Sessions, Billing, Circle
- `src/pages/auth/` — Login, AcceptInvite, ForgotPassword, ResetPassword
- `src/api/` — response types, fetch client, and the `useApi` hook
- `src/state/` — auth (signed-in client from `/me`) and the next-steps checklist, shared across pages
- `src/lib/` — date/money formatting and program timeline helpers

## Access

The portal is invite-only; there is no public sign-up. Kadi creates the client's account in the backend,
which emails an invite link to `/invite/:token`. The client sets a password there and is signed in. After
that they use `/login`, with `/forgot-password` → emailed `/reset-password/:token` link for resets.

Everything except those four pages is behind `RequireAuth`. The session lives in an httpOnly cookie set by
the backend; `GET /me` returning 401 means signed out, and a 401 from any other request (an expired
session) sends the client back to `/login`, returning them to the page they were on after signing in.

## Backend

All data comes from the API. Copy `.env.example` to `.env.local` and set `API_PROXY_TARGET` to your
backend for local dev. Requests go to `VITE_API_URL` (default `/api`) with cookies included.

The expected response shapes are in [`src/api/types.ts`](src/api/types.ts):

| Method | Path                 | Body                            | Returns            |
| ------ | -------------------- | ------------------------------- | ------------------ |
| POST   | `/auth/login`        | `{ email, password }`           | `Me`               |
| POST   | `/auth/logout`       |                                 | 204                |
| GET    | `/auth/invite/:token`|                                 | `Invite` (404/410 if expired or used) |
| POST   | `/auth/invite/:token`| `{ password }`                  | `Me`               |
| POST   | `/auth/forgot-password` | `{ email }`                  | 204, always        |
| POST   | `/auth/reset-password`  | `{ token, password }`        | `Me` (404/410 if expired) |
| GET    | `/me`                |                                 | `Me`, or 401 when signed out |
| GET    | `/program`           |                                 | `Program`          |
| GET    | `/sessions`          |                                 | `SessionsResponse` |
| GET    | `/next-steps`        |                                 | `NextStepGroup[]`  |
| PATCH  | `/next-steps/:id`    | `{ done }`                      | anything / 204     |
| GET    | `/blueprint`         |                                 | `Blueprint`        |
| GET    | `/billing`           |                                 | `BillingResponse`  |
| GET    | `/circle`            |                                 | `CircleResponse`   |
| POST   | `/circle/journal`    | `{ promptId?, body, shared }`   | `JournalEntry`     |
| PUT    | `/circle/rsvp`       | `{ going }`                     | `RsvpResponse`     |

Dates are ISO strings and are shown in the viewer's time zone. Labels like "Due in 20 days",
"Partially paid" and "Month 2 of 4" are computed in the app from the raw fields.
