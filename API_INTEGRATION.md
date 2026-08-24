# API Integration — Frontend ↔ Backend

This document maps every **RentNest client** feature to the **actual backend endpoint** it calls. All endpoints below were verified against the Express route definitions in `rentnest-backend/src/modules/**/*.route.ts` and the client call sites in `rentnest-clien`. No placeholders.

## Base URL & how requests reach the backend

- **API base URL** (`config/env.ts`): `process.env.NEXT_PUBLIC_API_URL` — defaults to `http://localhost:5000/api/v1`; production is `https://rentnest-backend-83n7.onrender.com/api/v1`.
- Every backend path below is relative to that `/api/v1` prefix (e.g. `POST /auth/login` → `…/api/v1/auth/login`).
- Requests reach the backend by **three** transports:
  1. **Direct (axios)** — `lib/axios.ts` (`api.*`). Public reads and the tenant/landlord authenticated calls. On the server it attaches the `Bearer` token; in the browser it relies on `withCredentials`.
  2. **Account proxy** — `app/api/account/[...path]/route.ts`. The browser can't attach the httpOnly access-token cookie, so profile/password mutations are forwarded server-side. Client path `/api/account/<x>` → backend endpoint (allow-listed).
  3. **Admin proxy** — `app/api/admin/[...path]/route.ts`. Same reason; client path `/api/admin/<x>` → backend `/admin/<x>`.
- The **Backend Endpoint** column always shows the real endpoint that ultimately runs; the **Transport** column notes which of the three paths above is used.

---

## Authentication

| Frontend Feature | Method | Backend Endpoint | Transport | Used By |
|---|---|---|---|---|
| Login | POST | `/auth/login` | axios | Login page → `app/(auth)/_action/authAction.ts` (`loginAction`) |
| Register | POST | `/auth/register` | axios | Register page → `authAction.ts` (`registerUser`; then auto-login via `/auth/login`) |
| Refresh access token | POST | `/auth/refresh-token` | axios | `service/refreshToken.ts`, called by `proxy.ts` middleware |
| Get current user | GET | `/auth/me` | axios | `service/getMe.ts` (server) & `hooks/use-me.ts` (navbar, sidebar) |
| Change password | PATCH | `/auth/change-password` | account proxy | Settings page → `hooks/use-change-password.ts` |
| Logout | — | *(no backend call)* | — | `authAction.ts`/`logoutAction.ts` clear the `accessToken`/`refreshToken` cookies locally. Backend `POST /auth/logout` exists but is **not** invoked. |

## Profile / User

| Frontend Feature | Method | Backend Endpoint | Transport | Used By |
|---|---|---|---|---|
| Update profile (name/phone/bio) | PATCH | `/user/profile` | account proxy | Settings page → `hooks/use-update-profile.ts` |
| Update profile picture | PATCH | `/user/profile/picture` | account proxy | Settings page → `hooks/use-update-avatar.ts` |
| Host avatar image | POST | `https://api.imgbb.com/1/upload` *(external)* | direct fetch | `lib/upload-image.ts` — turns a picked file into a URL, which is then sent to `/user/profile/picture`. Same host also used by `use-create-property.ts` / `use-update-property.ts` for listing images. |
| Public user profile | GET | `/user/:id` | — | Available on backend; **not** currently called by the client. |

## Properties

| Frontend Feature | Method | Backend Endpoint | Transport | Used By |
|---|---|---|---|---|
| Browse / search properties | GET | `/properties` | axios | Properties page → `hooks/use-properties.ts` (`components/sections/properties-section.tsx`) |
| Featured properties | GET | `/properties?isFeatured=true` | axios | Home page → `hooks/use-featured-properties.ts` (falls back to `/properties`, then to mock data) |
| Property details | GET | `/properties/:id` | axios | Property details page → `app/(public)/properties/[id]/page.tsx` & `hooks/use-property.ts` |
| My properties (landlord) | GET | `/properties/my-properties` | axios | Landlord my-properties → `hooks/use-my-properties.ts`, `landlord-dashboard-content.tsx` |
| Create property | POST | `/properties` | axios | Landlord create-property form → `hooks/use-create-property.ts` |
| Update property | PATCH | `/properties/:id` | axios | Landlord edit-property form → `hooks/use-update-property.ts` |
| Toggle availability | PATCH | `/properties/:id` *(sends `{status}`)* | axios | Landlord property card → `hooks/use-toggle-availability.ts`. Uses the general update route; the dedicated `/properties/:id/status` route exists on the backend but is **not** used. |
| Delete property | DELETE | `/properties/:id` | axios | Landlord property card → `hooks/use-delete-property.ts` |

## Categories

| Frontend Feature | Method | Backend Endpoint | Transport | Used By |
|---|---|---|---|---|
| List categories | GET | `/categories` | axios | `hooks/use-categories.ts` — hero, categories section, create/edit property forms, admin properties filter |

## Rental Requests

| Frontend Feature | Method | Backend Endpoint | Transport | Used By |
|---|---|---|---|---|
| Submit rental request | POST | `/rentals` | axios | Property details → `components/property/rental-request-dialog.tsx` → `hooks/use-create-rental-request.ts` |
| My rental requests (tenant) | GET | `/rentals/my-rentals` | axios | Tenant dashboard & `rental-requests-list.tsx` → `hooks/use-my-rentals.ts` |
| Incoming requests (landlord) | GET | `/rentals/requests` | axios | Landlord requests page → `hooks/use-rental-requests.ts`, `landlord-dashboard-content.tsx` |
| Rental request details | GET | `/rentals/:id` | axios | Request detail & payment client → `hooks/use-rental-request-detail.ts` |
| Approve request | PATCH | `/rentals/:id/approve` | axios | Landlord `rental-requests-table.tsx` → `hooks/use-update-rental-request.ts` |
| Reject request | PATCH | `/rentals/:id/reject` | axios | Landlord `rental-requests-table.tsx` → `hooks/use-update-rental-request.ts` |

Backend routes `PATCH /rentals/:id/cancel` and `GET /rentals/history` exist but are **not** currently called by the client.

## Payments

| Frontend Feature | Method | Backend Endpoint | Transport | Used By |
|---|---|---|---|---|
| Create payment intent | POST | `/payments/create-intent` | axios | Tenant payment flow → `hooks/use-create-payment-intent.ts` (`payment-client.tsx`, `rental-requests-list.tsx`) |
| Confirm payment | POST | `/payments/confirm` | axios | Payment success page → `hooks/use-confirm-payment.ts` |
| Payment history | GET | `/payments/my-payments` | axios | Payment history & tenant dashboard → `hooks/use-my-payments.ts` |

## Dashboards

| Frontend Feature | Method | Backend Endpoint | Transport | Used By |
|---|---|---|---|---|
| Landlord dashboard stats | GET | `/landlord/dashboard` | axios | Landlord dashboard → `hooks/use-landlord-dashboard.ts` |
| Tenant dashboard stats | GET | `/rentals/my-rentals` + `/payments/my-payments` | axios | Tenant dashboard → `tenant-dashboard-content.tsx` composes stats client-side. Backend `GET /tenant/dashboard` exists but is **not** used. |

## Admin (all via the admin proxy → `/admin/*`)

| Frontend Feature | Method | Backend Endpoint | Transport | Used By |
|---|---|---|---|---|
| Admin overview stats | GET | `/admin/dashboard` | admin proxy | Admin overview → `hooks/use-admin-dashboard.ts` |
| List all users | GET | `/admin/users` | admin proxy | Admin users table → `hooks/use-admin-users.ts` |
| Ban / unban user | PATCH | `/admin/users/:id/status` | admin proxy | Admin users table → `hooks/use-admin-users.ts` |
| Delete user | DELETE | `/admin/users/:id` | admin proxy | Admin users table → `hooks/use-admin-users.ts` |
| List all properties | GET | `/admin/properties` | admin proxy | Admin properties table → `hooks/use-admin-properties.ts`, `use-admin-property-index.ts` |
| Delete any property | DELETE | `/admin/properties/:id` | admin proxy | Admin properties table → `hooks/use-admin-properties.ts` |
| List all rentals | GET | `/admin/rentals` | admin proxy | Admin rentals table & overview → `hooks/use-admin-rentals.ts`, `use-admin-dashboard.ts` |

Backend `GET /admin/users/:id` exists but is **not** currently called by the client.

## Reviews

The backend exposes a full review API — `POST /reviews`, `GET /reviews/properties/:id`, `PATCH /reviews/:id`, `DELETE /reviews/:id`. **No frontend integration exists yet** (review counts shown in the UI come from mock/placeholder data). Listed here for completeness.

---

## Response envelope

Every backend endpoint returns the shared `sendResponse` envelope, which the client relies on:

```json
{ "success": true, "statusCode": 200, "message": "…", "data": {}, "meta": { "page": 1, "limit": 10, "total": 42 } }
```

`meta` is present only on the paginated list endpoints (`/properties`, `/admin/properties`, `/admin/rentals`, `/admin/users`).
