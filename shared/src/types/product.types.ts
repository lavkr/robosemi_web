export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ProductDto {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  minStock: number;
  specifications: Record<string, any>;
  tags: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  seoTitle?: string;
  seoDescription?: string;
  sellerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFiltersDto {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  brand?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  minStock?: number;
  specifications?: Record<string, any>;
  tags?: string[];
  weight?: number;
  dimensions?: ProductDimensions;
  seoTitle?: string;
  seoDescription?: string;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface ReviewDto {
  _id: string;
  product: string;
  user: { name: string; email: string };
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
}
