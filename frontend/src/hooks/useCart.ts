'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE = () => process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  description?: string;
  discount?: number;
  quantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  wishlist: Product[];
  directPurchaseItem: CartItem | null;
  appliedCoupon: any;
  isLoadingCart: boolean;
  isLoadingWishlist: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: (skipDB?: boolean) => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: (skipDB?: boolean) => Promise<void>;
  setDirectPurchaseItem: (item: CartItem | null) => void;
  getDirectPurchaseTotal: () => number;
  loadCartFromDB: () => Promise<void>;
  loadWishlistFromDB: () => Promise<void>;
  setAppliedCoupon: (coupon: any) => void;
  removeCoupon: () => void;
  getCouponDiscount: () => number;
  syncCartToDB: () => Promise<void>;
  syncWishlistToDB: () => Promise<void>;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      directPurchaseItem: null,
      appliedCoupon: null,
      isLoggedIn: false,
      isLoadingCart: false,
      isLoadingWishlist: false,

      addToCart: async (product) => {
        const { isLoggedIn } = get();

        set((state) => {
          const existingItem = state.cart.find((item) => item._id === product._id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        });

        if (isLoggedIn) {
          try {
            await fetch(`${API_BASE()}/cart`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: product._id, quantity: 1 })
            });
          } catch (error) {
            console.error('Failed to add to cart in DB:', error);
          }
        }
      },

      removeFromCart: async (productId) => {
        const { isLoggedIn } = get();

        set((state) => ({
          cart: state.cart.filter((item) => item._id !== productId),
        }));

        if (isLoggedIn) {
          try {
            await fetch(`${API_BASE()}/cart?productId=${productId}`, {
              method: 'DELETE'
            });
          } catch (error) {
            console.error('Failed to remove from cart in DB:', error);
          }
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { isLoggedIn } = get();

        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        }));

        if (isLoggedIn) {
          try {
            await fetch(`${API_BASE()}/cart`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId, quantity })
            });
          } catch (error) {
            console.error('Failed to update quantity in DB:', error);
          }
        }
      },

      clearCart: async (skipDB = false) => {
        const { isLoggedIn } = get();

        set({ cart: [] });

        if (isLoggedIn && !skipDB) {
          try {
            await fetch(`${API_BASE()}/cart`, { method: 'DELETE' });
          } catch (error) {
            console.error('Failed to clear cart in DB:', error);
          }
        }
      },

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const finalPrice = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
          return total + finalPrice * item.quantity;
        }, 0);
      },

      getCartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      addToWishlist: async (product) => {
        const { isLoggedIn } = get();

        set((state) => {
          if (!state.wishlist.find((item) => item._id === product._id)) {
            return { wishlist: [...state.wishlist, product] };
          }
          return state;
        });

        if (isLoggedIn) {
          try {
            await fetch(`${API_BASE()}/wishlist`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: product._id })
            });
          } catch (error) {
            console.error('Failed to add to wishlist in DB:', error);
          }
        }
      },

      removeFromWishlist: async (productId) => {
        const { isLoggedIn } = get();

        set((state) => ({
          wishlist: state.wishlist.filter((item) => item._id !== productId),
        }));

        if (isLoggedIn) {
          try {
            await fetch(`${API_BASE()}/wishlist?productId=${productId}`, {
              method: 'DELETE'
            });
          } catch (error) {
            console.error('Failed to remove from wishlist in DB:', error);
          }
        }
      },

      isInWishlist: (productId) => {
        const { wishlist } = get();
        return wishlist.some((item) => item._id === productId);
      },

      clearWishlist: async (skipDB = false) => {
        const { isLoggedIn } = get();

        set({ wishlist: [] });

        if (isLoggedIn && !skipDB) {
          try {
            await fetch(`${API_BASE()}/wishlist`, { method: 'DELETE' });
          } catch (error) {
            console.error('Failed to clear wishlist in DB:', error);
          }
        }
      },

      setDirectPurchaseItem: (item) => set({ directPurchaseItem: item }),

      getDirectPurchaseTotal: () => {
        const { directPurchaseItem } = get();
        if (!directPurchaseItem) return 0;
        const finalPrice = directPurchaseItem.discount
          ? directPurchaseItem.price * (1 - directPurchaseItem.discount / 100)
          : directPurchaseItem.price;
        return finalPrice * directPurchaseItem.quantity;
      },

      loadCartFromDB: async () => {
        const { isLoadingCart } = get();
        if (isLoadingCart) return;

        set({ isLoadingCart: true });

        try {
          const response = await fetch(`${API_BASE()}/cart`);
          if (response.ok) {
            const data = await response.json();
            set({ cart: data.cart || [], isLoggedIn: true });
          }
        } catch (error) {
          console.error('Failed to load cart from DB:', error);
        } finally {
          set({ isLoadingCart: false });
        }
      },

      loadWishlistFromDB: async () => {
        const { isLoadingWishlist } = get();
        if (isLoadingWishlist) return;

        set({ isLoadingWishlist: true });

        try {
          const response = await fetch(`${API_BASE()}/wishlist`);
          if (response.ok) {
            const data = await response.json();
            set({ wishlist: data.wishlist || [], isLoggedIn: true });
          }
        } catch (error) {
          console.error('Failed to load wishlist from DB:', error);
        } finally {
          set({ isLoadingWishlist: false });
        }
      },

      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),

      removeCoupon: () => set({ appliedCoupon: null }),

      getCouponDiscount: () => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;

        const subtotal = get().getCartTotal();

        // Check minimum order value and auto-remove coupon if not met
        if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) {
          // Auto-remove coupon if minimum order value is not met
          setTimeout(() => get().removeCoupon(), 0);
          return 0;
        }

        let discountAmount = 0;
        if (appliedCoupon.type === 'percentage') {
          discountAmount = (subtotal * appliedCoupon.value) / 100;
          if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
            discountAmount = appliedCoupon.maxDiscount;
          }
        } else {
          discountAmount = Math.min(appliedCoupon.value, subtotal);
        }

        return Math.round(discountAmount);
      },

      setIsLoggedIn: (status) => set({ isLoggedIn: status }),

      syncCartToDB: async () => {
        const { cart, isLoggedIn } = get();
        if (!isLoggedIn || cart.length === 0) return;

        try {
          await fetch(`${API_BASE()}/cart/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart })
          });
        } catch (error) {
          console.error('Failed to sync cart to DB:', error);
        }
      },

      syncWishlistToDB: async () => {
        const { wishlist, isLoggedIn } = get();
        if (!isLoggedIn || wishlist.length === 0) return;

        try {
          await fetch(`${API_BASE()}/wishlist/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wishlist })
          });
        } catch (error) {
          console.error('Failed to sync wishlist to DB:', error);
        }
      },
    }),
    {
      name: 'robosemi-cart',
    }
  )
);
