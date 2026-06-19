import { apiGet, apiPost, apiPut, apiDelete } from './client';

export const cartApi = {
  get: () => apiGet('/cart'),
  add: (productId: string, quantity: number) => apiPost('/cart', { productId, quantity }),
  update: (productId: string, quantity: number) => apiPut('/cart', { productId, quantity }),
  remove: (productId: string) => apiDelete(`/cart?productId=${productId}`),
  clear: () => apiDelete('/cart'),
  sync: (cart: any[]) => apiPost('/cart/sync', { cart }),
};
