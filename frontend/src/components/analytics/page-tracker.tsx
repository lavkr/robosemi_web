'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PageTrackerProps {
  page: string;
}

export function PageTracker({ page }: PageTrackerProps) {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(page);
  }, [page, trackPageView]);

  return null;
}