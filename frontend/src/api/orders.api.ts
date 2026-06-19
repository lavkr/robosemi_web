import { apiGet, apiPost, apiPut } from './client';

export const ordersApi = {
  getAll: (params?: Record<string, any>) => apiGet('/orders', params),
  getById: (id: string) => apiGet(`/orders/${id}`),
  create: (data: any) => apiPost('/orders', data),
  cancel: (id: string, data: any) => apiPut(`/orders/${id}/cancel`, data),
  return: (id: string, data: any) => apiPut(`/orders/${id}/return`, data),
  track: (orderNumber: string) => apiGet('/orders/track', { orderNumber }),
  checkPurchase: (productId: string) => apiGet('/orders/check-purchase', { productId }),
};
