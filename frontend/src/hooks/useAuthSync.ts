'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from './useCart';

export function useAuthSync() {
  const { data: session, status } = useSession();
  const { loadCartFromDB, loadWishlistFromDB, setIsLoggedIn, clearCart, clearWishlist } = useCart();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      // User logged in - sync data only once
      setIsLoggedIn(true);
      if (!hasLoadedRef.current) {
        loadCartFromDB();
        loadWishlistFromDB();
        hasLoadedRef.current = true;
      }
    } else {
      // User logged out - clear data and localStorage
      setIsLoggedIn(false);
      clearCart(true); // Skip DB sync on logout
      clearWishlist(true); // Skip DB sync on logout
      hasLoadedRef.current = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('robosemi-cart');
      }
    }
  }, [session, status, setIsLoggedIn, loadCartFromDB, loadWishlistFromDB, clearCart, clearWishlist]);

  return { isLoggedIn: !!session?.user };
}