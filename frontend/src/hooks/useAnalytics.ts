'use client';

import { useCallback } from 'react';

const API_BASE = () => process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export function useAnalytics() {
  const trackEvent = useCallback(async (eventData: {
    type: 'page_view' | 'product_view' | 'add_to_cart' | 'search';
    productId?: string;
    page?: string;
    searchQuery?: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      const sessionId = localStorage.getItem('sessionId') || 
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem('sessionId', sessionId);

      await fetch(`${API_BASE()}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          sessionId,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  const trackProductView = useCallback((productId: string) => {
    trackEvent({
      type: 'product_view',
      productId,
    });
  }, [trackEvent]);

  const trackPageView = useCallback((page: string) => {
    trackEvent({
      type: 'page_view',
      page,
    });
  }, [trackEvent]);

  const trackAddToCart = useCallback((productId: string) => {
    trackEvent({
      type: 'add_to_cart',
      productId,
    });
  }, [trackEvent]);

  const trackSearch = useCallback((searchQuery: string) => {
    trackEvent({
      type: 'search',
      searchQuery,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackProductView,
    trackPageView,
    trackAddToCart,
    trackSearch,
  };
}