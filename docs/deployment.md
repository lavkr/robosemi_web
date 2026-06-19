# Deployment Guide

## Development Setup

### Prerequisites
- Node.js 20+
- pnpm or npm
- MongoDB Atlas account
- Cloudinary account
- Razorpay account
- Shiprocket account

### Local Development

```bash
# 1. Clone and install
cd robosemi
npm install

# 2. Configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# 3. Configure frontend environment  
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your values

# 4. Run both services in parallel
npm run dev
```

Backend runs on http://localhost:5000  
Frontend runs on http://localhost:3000

---

## Production Deployment

### Backend — Deploy to Railway / Render / EC2

```bash
cd backend
npm run build
npm run start
```

Set environment variables on the platform.

### Frontend — Deploy to Vercel

```bash
cd frontend
npm run build
```

Set `NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1` in Vercel dashboard.

---

## Environment Variables Quick Reference

### Backend `.env`
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://robosemi.in
NEXTAUTH_SECRET=<same as frontend>
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=noreply@robosemi.in
SHIPROCKET_EMAIL=...
SHIPROCKET_PASSWORD=...
DEFAULT_PICKUP_PINCODE=400001
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=https://api.robosemi.in/api/v1
NEXTAUTH_URL=https://robosemi.in
NEXTAUTH_SECRET=<same as backend>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MY_GH_CLIENT_ID=...
MY_GH_CLIENT_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
```
