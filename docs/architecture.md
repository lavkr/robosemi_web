# RoboSemi Enterprise Architecture

## Overview

RoboSemi is a full-stack e-commerce platform for IoT, robotics, and automation components. This monorepo separates the application into three independent packages.

```
robosemi/
├── backend/    → Express.js REST API  (port 5000)
├── frontend/   → Next.js web app      (port 3000)
└── shared/     → Shared TypeScript types
```

---

## Backend Architecture

```
backend/src/
├── config/
│   ├── env.ts          ← Zod-validated environment variables
│   └── database.ts     ← MongoDB connection
├── models/             ← 16 Mongoose schemas
├── repositories/       ← 16 database abstraction classes
├── services/           ← Business logic layer
│   ├── auth.service.ts
│   ├── order.service.ts
│   ├── product.service.ts
│   ├── email.service.ts
│   ├── razorpay.service.ts
│   ├── shiprocket.service.ts
│   ├── cloudinary.service.ts
│   └── ...
├── controllers/        ← Request/response handlers (thin)
├── routes/v1/          ← Express routers (versioned)
├── middlewares/
│   ├── auth.middleware.ts      ← JWT verification
│   ├── role.middleware.ts      ← RBAC
│   ├── validate.middleware.ts  ← Zod body validation
│   ├── rateLimit.middleware.ts ← express-rate-limit
│   └── error.middleware.ts     ← Global error handler
├── helpers/
│   └── response.ts     ← Consistent { success, message, data, meta }
└── utils/
    └── order-number.ts
```

### Layer Responsibilities

| Layer | Responsibility |
|---|---|
| **Repository** | All database queries — models are never accessed directly outside repositories |
| **Service** | Business logic, orchestration, side effects |
| **Controller** | Parse request, call service, format response — no business logic |
| **Middleware** | Auth, validation, rate limiting — cross-cutting concerns |

---

## Frontend Architecture

```
frontend/src/
├── app/                ← Next.js App Router pages
│   ├── (admin)/        ← Admin dashboard
│   ├── (public)/       ← Customer-facing pages
│   └── (seller)/       ← Seller dashboard
├── components/
│   ├── ui/             ← shadcn/ui base components
│   ├── layout/         ← Header, Footer
│   ├── home/           ← Homepage sections
│   ├── product/        ← Product card
│   ├── blog/           ← Blog components
│   └── seo/            ← SEO utilities
├── hooks/              ← Custom React hooks
│   ├── useCart.ts      ← Zustand cart store
│   ├── useAuth.ts      ← Auth utilities
│   └── useAuthSync.ts  ← Cart/session sync
├── api/                ← Typed API client
│   ├── client.ts       ← Base fetch wrapper
│   ├── products.api.ts
│   ├── orders.api.ts
│   └── ...
├── types/              ← TypeScript type definitions
├── constants/          ← Routes, enums
└── utils/              ← Helper functions
```

---

## API Contract

All endpoints return:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [{ "path": ["email"], "message": "Invalid email" }]
  }
}
```

---

## Authentication Flow

```
Frontend (NextAuth) ──JWT──► Backend (verifies with NEXTAUTH_SECRET)
```

The frontend uses NextAuth.js for login/session management. The backend verifies the same JWT tokens using the shared `NEXTAUTH_SECRET`. No separate login system needed.

---

## Key Environment Variables

### Backend
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — For additional API tokens
- `NEXTAUTH_SECRET` — Shared with frontend to verify sessions
- `RAZORPAY_KEY_ID/SECRET` — Payment gateway
- `CLOUDINARY_*` — Image hosting
- `SMTP_*` — Email delivery
- `SHIPROCKET_*` — Logistics

### Frontend
- `NEXT_PUBLIC_API_URL` — Backend URL (e.g., `https://api.robosemi.in/api/v1`)
- `NEXTAUTH_URL` — Frontend URL
- `NEXTAUTH_SECRET` — Same as backend

---

## Module Map

| Module | Backend Routes | Frontend Pages |
|---|---|---|
| Auth | `/api/v1/auth/` | `/auth/login`, `/auth/register` |
| Products | `/api/v1/products/` | `/products`, `/products/[id]` |
| Orders | `/api/v1/orders/` | `/account/orders` |
| Cart | `/api/v1/cart/` | `/cart`, `/checkout` |
| Wishlist | `/api/v1/wishlist/` | `/wishlist`, `/account/wishlist` |
| Payments | `/api/v1/payments/` | `/checkout` |
| Seller | `/api/v1/seller/` | `/seller/*` |
| Admin | `/api/v1/admin/` | `/admin/*` |
| Blog | `/api/v1/blog/` | `/blog`, `/blog/[slug]` |
| Training | `/api/v1/trainings/` | `/training`, `/training/[slug]` |
| Projects | `/api/v1/projects/` | `/projects`, `/projects/[slug]` |
| Shipping | `/api/v1/shipping/` | Checkout page |
| Categories | `/api/v1/categories/` | `/categories/[category]` |
| Reviews | `/api/v1/reviews/` | Product detail page |
| Search | `/api/v1/search/` | `/search` |
| Upload | `/api/v1/upload/` | Admin/Seller product forms |
