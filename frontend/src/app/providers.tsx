'use client';

import { SessionProvider } from 'next-auth/react';
import { useAuthSync } from '@/hooks/useAuthSync';

function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  useAuthSync();
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSyncWrapper>
        {children}
      </AuthSyncWrapper>
    </SessionProvider>
  );
}