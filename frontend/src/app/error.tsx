'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Something went wrong!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              We encountered an unexpected error. Don't worry, our team has been notified 
              and we're working to fix it.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} size="lg">
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-muted rounded-lg text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Error Details (Development)</h3>
            <pre className="text-sm text-muted-foreground overflow-auto">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}