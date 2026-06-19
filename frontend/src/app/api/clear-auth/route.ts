import { NextResponse } from 'next/server';

// Visit /api/clear-auth to wipe all NextAuth cookies, then retry sign-in.
// Useful when a stale cookie from a previous session causes error=undefined.
export async function GET() {
  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = NextResponse.redirect(new URL('/auth/login', base));

  const cookieNames = [
    'next-auth.session-token',
    'next-auth.callback-url',
    'next-auth.csrf-token',
    'next-auth.state',
    'next-auth.pkce.code_verifier',
    '__Secure-next-auth.session-token',
    '__Secure-next-auth.callback-url',
    '__Host-next-auth.csrf-token',
  ];

  for (const name of cookieNames) {
    res.cookies.set(name, '', { expires: new Date(0), path: '/' });
  }

  return res;
}
