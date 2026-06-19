import { apiGet, apiPost, apiDelete } from './client';

export const wishlistApi = {
  get: () => apiGet('/wishlist'),
  add: (productId: string) => apiPost('/wishlist', { productId }),
  remove: (productId: string) => apiDelete(`/wishlist?productId=${productId}`),
  sync: (wishlist: any[]) => apiPost('/wishlist/sync', { wishlist }),
};
