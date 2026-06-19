import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5001/api/v1';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.MY_GH_CLIENT_ID!,
      clientSecret: process.env.MY_GH_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) return null;
          const user = data.data?.user || data.data;
          const token = data.data?.token;
          return {
            id: String(user._id || user.id),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.avatar || null,
            accessToken: token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',

  // Explicit cookie config fixes "State cookie was missing" in NextAuth v4 + App Router.
  // Without this, the defaults can produce wrong Secure/SameSite values that cause the
  // next-auth.state cookie to be absent when Google's callback reaches the handler.
  cookies: {
    state: {
      name: 'next-auth.state',
      options: { httpOnly: true, sameSite: 'lax' as const, path: '/', secure: false },
    },
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: { httpOnly: true, sameSite: 'lax' as const, path: '/', secure: false },
    },
    sessionToken: {
      name: 'next-auth.session-token',
      options: { httpOnly: true, sameSite: 'lax' as const, path: '/', secure: false },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: { httpOnly: true, sameSite: 'lax' as const, path: '/', secure: false },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: { httpOnly: true, sameSite: 'lax' as const, path: '/', secure: false },
    },
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Only runs on first sign-in — enrich the token
      if (user) {
        // For credentials: user already has id/role/accessToken from authorize()
        token.sub = String(user.id || token.sub);
        token.role = (user as any).role || token.role || 'user';
        token.accessToken = (user as any).accessToken || token.accessToken;
        token.picture = user.image || token.picture;
      }

      // For OAuth providers: sync with backend to get MongoDB ID + JWT
      if (account && (account.provider === 'google' || account.provider === 'github') && user?.email) {
        try {
          const res = await fetch(`${BACKEND_URL}/auth/oauth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider: account.provider,
              email: user.email,
              name: user.name || user.email,
              image: user.image,
              providerAccountId: account.providerAccountId,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              const dbUser = data.data?.user || data.data;
              token.sub = String(dbUser._id || dbUser.id || token.sub);
              token.role = dbUser.role || 'user';
              token.accessToken = data.data?.token;
            }
          }
        } catch {
          // Backend unavailable — sign-in still works, just no role/token from DB
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) || '';
        session.user.role = (token.role as string) || 'user';
        if (token.picture) session.user.image = token.picture as string;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
};
