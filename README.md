# RoboSemi — Electronics & Robotics E-Commerce Platform

A full-stack e-commerce platform for premium automation and electronics components, built for professionals and innovators in IoT, robotics, and embedded systems.

---

## Features

- **Product Catalog** — Browse electronics, IoT modules, robotics kits, sensors, and actuators
- **Smart Search** — Full-text product search with filters and categories
- **Deals & New Arrivals** — Curated sections for offers and latest products
- **Projects & Training** — Community projects and training programs
- **Shopping Cart & Checkout** — Seamless cart management with Razorpay payment integration
- **Order Tracking** — Real-time order status and Shiprocket shipping integration
- **Authentication** — Email/password, Google OAuth, and GitHub OAuth via NextAuth
- **Seller Portal** — Dedicated dashboard for sellers to manage listings
- **Admin Panel** — Full admin dashboard for orders, products, users, and settings
- **Account Dashboard** — User profile, order history, and wishlist
- **Cloudinary Image Management** — Optimized image uploads and delivery
- **Email Notifications** — Transactional emails via SMTP

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework with SSR/SSG |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Component library |
| NextAuth v4 | Authentication (Google, GitHub, Credentials) |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| JWT | Token-based auth |
| Cloudinary | Image storage |
| Razorpay | Payment gateway |
| Shiprocket | Shipping & logistics |
| Nodemailer | Email delivery |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Cloudinary | Media CDN |
| Razorpay | Payment processing |
| Shiprocket | Order fulfillment |

---

## Project Structure

```
robosemi/
├── backend/              # Express + TypeScript API
│   └── src/
│       ├── controllers/  # Route handlers
│       ├── models/       # Mongoose schemas
│       ├── routes/       # API route definitions
│       ├── services/     # Business logic
│       ├── middlewares/  # Auth, rate limiting, etc.
│       ├── repositories/ # Data access layer
│       └── utils/        # Helpers and utilities
├── frontend/             # Next.js 14 App Router
│   └── src/
│       ├── app/
│       │   ├── (public)/ # Customer-facing pages
│       │   ├── (admin)/  # Admin dashboard
│       │   ├── (seller)/ # Seller portal
│       │   └── api/      # Next.js API routes
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Auth config, utilities
│       └── types/        # TypeScript definitions
└── shared/               # Shared types and utilities
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account
- Google Cloud Console project (OAuth)
- Razorpay account
- Cloudinary account

---

## Installation

```bash
# Clone the repository
git clone https://github.com/lavkr/robosemi.git
cd robosemi

# Install all dependencies (monorepo)
npm install
```

---

## Environment Setup

### Backend — `backend/.env`

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/robosemi

PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

JWT_SECRET=<your-jwt-secret>
JWT_ACCESS_SECRET=<your-jwt-access-secret>
JWT_EXPIRES_IN=7d
NEXTAUTH_SECRET=<your-nextauth-secret>

RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
RAZORPAY_WEBHOOK_ID=<your-webhook-secret>

CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
CLOUDINARY_PRESET_NAME=<your-preset>

SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your@email.com
SMTP_PASS=<smtp-password>
SMTP_FROM=your@email.com

SHIPROCKET_EMAIL=<shiprocket-account-email>
SHIPROCKET_PASSWORD=<shiprocket-password>
DEFAULT_PICKUP_PINCODE=400001
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
BACKEND_URL=http://localhost:5001/api/v1

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-nextauth-secret>

GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>

MY_GH_CLIENT_ID=<github-oauth-app-client-id>
MY_GH_CLIENT_SECRET=<github-oauth-app-client-secret>

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
```

> **Google OAuth:** Add `http://localhost:3000/api/auth/callback/google` to Authorized Redirect URIs in Google Cloud Console.

---

## Running Locally

```bash
# Run both frontend and backend together
npm run dev

# Or run separately
npm run dev --workspace=backend   # http://localhost:5001
npm run dev --workspace=frontend  # http://localhost:3000
```

---

## Build

```bash
npm run build
```

---

## Deployment

### Frontend — Vercel (Recommended)

1. Import the repository on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add all `frontend/.env.local` variables in Vercel's Environment Variables
4. Update `NEXTAUTH_URL` to your production domain
5. Add your production domain to Google Cloud Console authorized redirect URIs

### Backend — Any Node.js host (Railway, Render, VPS)

1. Set all `backend/.env` variables in your hosting environment
2. Set `NODE_ENV=production`
3. Set `FRONTEND_URL` to your production frontend URL
4. Run `npm run build --workspace=backend` then start with `node dist/server.js`

---

## API Base URL

```
http://localhost:5001/api/v1
```

---

## License

MIT

---

*Built with Next.js 14, Express, MongoDB, and TypeScript*
