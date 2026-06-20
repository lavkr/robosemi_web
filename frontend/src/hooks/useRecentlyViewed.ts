'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'robosemi_recently_viewed';
const MAX_ITEMS = 8;

export interface RecentProduct {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  const addProduct = (product: RecentProduct) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  };

  return { items, addProduct, clearAll };
}
