# RentNest — Client

RentNest is a full-stack rental marketplace that connects **tenants** looking for a place to live with **landlords** listing properties, under the oversight of an **admin**. This repository is the **frontend** (Next.js App Router) that talks to the RentNest backend REST API (`/api/v1`).

Tenants browse and search listings, send rental requests, and pay securely with Stripe. Landlords manage their own listings and approve or reject incoming requests. Admins moderate users, properties, and the platform-wide rental pipeline. Access to every area is gated by role.

> The API contract this client consumes is documented in [`API_INTEGRATION.md`](./API_INTEGRATION.md).

---

## Features

- **Property marketplace** — browse, search, filter (location, category, price, bedrooms) and view property details.
- **Authentication** — register and log in as a tenant or landlord; JWT-based sessions with automatic access-token refresh.
- **Tenant dashboard** — track rental requests, active rentals, and payment history.
- **Landlord dashboard** — overview of listings, incoming requests, and earnings.
- **Admin dashboard** — platform overview, user management, property moderation, and global rental-request management.
- **Rental requests** — tenants submit requests; landlords approve or reject them.
- **Property CRUD** — landlords create, edit, toggle availability, and delete their listings (with image upload).
- **Stripe payment** — pay for an approved rental via Stripe Checkout, with confirmation handling.
- **Reviews** — property reviews. *(Backend API is available; frontend integration is planned and not yet wired up.)*
- **Role-based access** — routes and actions are restricted by role (`TENANT` / `LANDLORD` / `ADMIN`) via middleware.
- **Responsive UI** — mobile-first layouts with light/dark theme support.

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** |
| UI components | **shadcn/ui** (Radix primitives) |
| Server state / data fetching | **TanStack Query v5** |
| Forms | **React Hook Form** |
| Validation | **Zod** |
| HTTP client | **Axios** |
| Notifications | **Sonner** (toasts) |
| Payments | **Stripe** (`@stripe/stripe-js`) |
| Client state | **Zustand** — *listed in the intended stack; not currently a dependency.* App state today uses TanStack Query (server state) + local React state. |

Also used: `next-themes` (dark mode), `framer-motion` (animation), `date-fns` (dates), `lucide-react` / `react-icons` (icons), `jsonwebtoken` (token verification in middleware).

---

## Environment Variables

Create a `.env` (or `.env.local`) file in the project root. **Never commit real secrets.** The values below are placeholders — replace them with your own.

| Variable | Required | Exposure | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Public | Base URL of the backend API, including the `/api/v1` suffix. |
| `NEXT_PUBLIC_APP_NAME` | No | Public | Display name of the app. Defaults to `RentNest`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes (for payments) | Public | Stripe **publishable** key (`pk_test_...` / `pk_live_...`). Publishable keys are safe to expose; never use a secret key here. |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Yes (for image upload) | Public | ImgBB API key used to host property and avatar images. |
| `JWT_ACCESS_SECRET` | Yes | **Server-only** | Secret used by the Next middleware (`proxy.ts`) to verify the access token. Must match the backend. |
| `JWT_REFRESH_SECRET` | Yes | **Server-only** | Secret used by the middleware to verify the refresh token. Must match the backend. |

> Variables prefixed with `NEXT_PUBLIC_` are embedded in the browser bundle and are **not** secret. `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` have **no** prefix and stay server-side — do not add `NEXT_PUBLIC_` to them.

Example `.env` template:

```bash
# Backend API (include /api/v1)
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=RentNest

# Stripe (publishable key only)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# ImgBB image hosting
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# JWT secrets — must match the backend (server-side only)
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

---

## Installation

Requires **Node.js 18.18+** (Node 20 LTS recommended) and npm.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd rentnest-clien

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env   # then fill in the values (see Environment Variables above)
```

---

## Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

---

## Deployment

This app is designed to deploy on **[Vercel](https://vercel.com)**.

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In the Vercel dashboard, **Add New → Project** and import the repository.
   - If the frontend lives in a subfolder of a monorepo, set the **Root Directory** to `rentnest-clien`.
   - Vercel auto-detects Next.js — the default **Build Command** (`next build`) and **Output** settings need no changes.
3. Under **Settings → Environment Variables**, add every variable from the [Environment Variables](#environment-variables) section (for Production, Preview, and Development as needed). Use your **production** backend URL and **live** Stripe key for the Production environment.
4. Click **Deploy**. Vercel builds and hosts the app; each push to the default branch triggers a new production deployment, and pull requests get preview URLs.

Ensure the backend allows requests from your Vercel domain (CORS) and that `NEXT_PUBLIC_API_URL` points to the deployed backend.

---

## Admin Credentials

<!-- =========================================================
     ADMIN CREDENTIALS — FILL IN MANUALLY
     Add your real admin login here. These are intentionally
     left blank; do not commit real credentials to a public repo.
     ========================================================= -->

> **Add your real admin credentials below.** *(Left blank on purpose — not auto-generated.)*

- **Email:** `<add-admin-email>`
- **Password:** `<add-admin-password>`
