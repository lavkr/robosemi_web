import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    // Custom logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin' || token?.role === 'staff';
        }
        if (pathname.startsWith('/seller')) {
          return token?.role === 'seller' || token?.role === 'admin';
        }
        if (pathname.startsWith('/account')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  // DO NOT include /api/auth paths — withAuth running there breaks NextAuth callbacks
  matcher: ['/admin/:path*', '/seller/:path*', '/account/:path*'],
};
