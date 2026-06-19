'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

const errorMessages: Record<string, string> = {
  Configuration: 'Server configuration problem — contact support.',
  AccessDenied: 'You denied access. Try again and approve the permissions.',
  Verification: 'The sign-in link expired or was already used.',
  OAuthSignin: 'Could not start Google sign-in. Try again.',
  OAuthCallback: 'Google returned an error. This is usually a stale cookie — click "Clear & Retry" below.',
  OAuthCreateAccount: 'Could not create an account with your Google credentials.',
  OAuthAccountNotLinked: 'This email is registered with email/password. Please log in with your password instead.',
  Callback: 'An error in the sign-in flow. Click "Clear & Retry" below.',
  SessionRequired: 'You must be signed in to access this page.',
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');
  const isUndefined = !errorCode || errorCode === 'undefined';
  const key = isUndefined ? 'OAuthCallback' : errorCode;
  const message = errorMessages[key] || 'An unexpected error occurred. Click "Clear & Retry" below.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Sign-in Error</CardTitle>
          {!isUndefined && (
            <p className="text-sm text-muted-foreground mt-1">
              Code: <code className="bg-muted px-1 rounded">{errorCode}</code>
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">{message}</p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 space-y-1">
            <p><strong>Fix:</strong> Click "Clear &amp; Retry" — this removes stale sign-in cookies and starts fresh.</p>
            <p className="text-xs">Or try in an <strong>Incognito window</strong> (⌘+Shift+N on Mac).</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/api/clear-auth">
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear &amp; Retry Sign-in
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Try Again Without Clearing</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
