/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Prevents Next.js from issuing a 308 (permanent, browser-cached) redirect
  // for /api/auth/callback/google/ → /api/auth/callback/google.
  // Without this, a cached redirect loop drops the next-auth.state cookie.
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },

};

module.exports = nextConfig;
