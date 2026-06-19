import { apiGet, apiPost, apiPut, apiDelete } from './client';

// Also export legacy helper functions used by deals/featured pages
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ProductsResponse {
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  featured?: string;
} = {}): Promise<ApiResponse<ProductsResponse>> {
  try {
    const data = await apiGet<ProductsResponse>('/products', params as Record<string, any>);
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch products' };
  }
}

export async function fetchBestSellers(): Promise<ApiResponse<ProductsResponse>> {
  return fetchProducts({ sortBy: 'rating', sortOrder: 'desc', limit: 50 });
}

export async function fetchFeaturedProducts(): Promise<ApiResponse<ProductsResponse>> {
  return fetchProducts({ featured: 'true', limit: 50 });
}

export async function fetchDealsProducts(): Promise<ApiResponse<ProductsResponse>> {
  try {
    const data = await apiGet<any[]>('/products', { limit: 100 });
    const products = Array.isArray(data) ? data : (data as any).data || [];
    const dealsProducts = products.filter(
      (product: any) => product.discount && product.discount > 0
    );
    return { success: true, data: { products: dealsProducts, pagination: { page: 1, limit: dealsProducts.length, total: dealsProducts.length, pages: 1 } } };
  } catch (error) {
    console.error('Error fetching deals:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch deals' };
  }
}

export const productsApi = {
  getAll: (params?: Record<string, any>) => apiGet('/products', params),
  getById: (id: string) => apiGet(`/products/${id}`),
  getFilters: () => apiGet('/products/filters'),
  getReviews: (id: string) => apiGet(`/products/${id}/reviews`),
  create: (data: any) => apiPost('/products', data),
  update: (id: string, data: any) => apiPut(`/products/${id}`, data),
  delete: (id: string) => apiDelete(`/products/${id}`),
  search: (q: string) => apiGet('/search', { q }),
};
