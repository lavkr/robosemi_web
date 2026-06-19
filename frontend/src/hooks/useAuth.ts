import { useSession } from 'next-auth/react';
import { useCart } from './useCart';

export function useAuth() {
  const { data: session, status } = useSession();
  const cart = useCart();
  
  const currentUser = session?.user;
  const isLoading = status === 'loading';
  const isAuthenticated = !!currentUser;
  
  return {
    user: currentUser,
    isLoading,
    isAuthenticated,
    session,
    status,
    // Include cart methods for components that need them
    ...cart
  };
}