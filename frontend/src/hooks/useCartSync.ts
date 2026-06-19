import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export function useCartSync() {
  const { user } = useAuth();
  const { loadCartFromDB, loadWishlistFromDB } = useCart();

  useEffect(() => {
    if (user) {
      // Load data from database when user is available
      loadCartFromDB();
      loadWishlistFromDB();
    }
  }, [user, loadCartFromDB, loadWishlistFromDB]);
}