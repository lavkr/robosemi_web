import { FilterQuery } from 'mongoose';
import { productRepository } from '../repositories/product.repository';
import { IProduct } from '../models/Product.model';
import { RequestUser } from '../middlewares/auth.middleware';

export interface ProductFiltersDto {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  brand?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  discount?: number;
  images?: string[];
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  minStock?: number;
  specifications?: Record<string, unknown>;
  tags?: string[];
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  seoTitle?: string;
  seoDescription?: string;
  isFeatured?: boolean;
  sellerId?: string;
}

export type UpdateProductDto = Partial<CreateProductDto>;

class ProductService {
  async getProducts(
    filters: ProductFiltersDto,
  ): Promise<{ products: IProduct[]; pagination: any }> {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      featured,
      brand,
      sort,
      page = 1,
      limit = 20,
    } = filters;

    const query: FilterQuery<IProduct> = { isActive: true };

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (featured !== undefined) query.isFeatured = featured;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const skip = (page - 1) * limit;

    let products: IProduct[];
    let total: number;

    if (search) {
      [products, total] = await Promise.all([
        productRepository.searchProducts(search, { skip, limit, sort: sortOption }),
        productRepository.count({ $text: { $search: search }, isActive: true }),
      ]);
    } else {
      [products, total] = await Promise.all([
        productRepository.findMany(query, { skip, limit, sort: sortOption }),
        productRepository.count(query),
      ]);
    }

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return productRepository.findById(id);
  }

  async createProduct(data: CreateProductDto, userId: string): Promise<IProduct> {
    return productRepository.create({ ...data, createdBy: userId } as any);
  }

  async updateProduct(
    id: string,
    data: UpdateProductDto,
    user: RequestUser,
  ): Promise<IProduct> {
    const product = await productRepository.findById(id);
    if (!product) {
      const err: any = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }

    const isAdmin = user.role === 'admin' || user.role === 'staff';
    const isOwner =
      product.sellerId?.toString() === user.userId ||
      product.createdBy?.toString() === user.userId;

    if (!isAdmin && !isOwner) {
      const err: any = new Error('You can only update your own products');
      err.statusCode = 403;
      throw err;
    }

    const updated = await productRepository.updateById(id, data);
    return updated!;
  }

  async deleteProduct(id: string, user: RequestUser): Promise<void> {
    const product = await productRepository.findById(id);
    if (!product) {
      const err: any = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }

    const isAdmin = user.role === 'admin' || user.role === 'staff';
    if (!isAdmin) {
      const err: any = new Error('Only admins can delete products');
      err.statusCode = 403;
      throw err;
    }

    await productRepository.deleteById(id);
  }

  async getProductFilters(): Promise<{
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
  }> {
    const { default: ProductModel } = await import('../models/Product.model');

    const [categories, brands, priceRange] = await Promise.all([
      ProductModel.distinct('category', { isActive: true }),
      ProductModel.distinct('brand', { isActive: true }),
      ProductModel.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
      ]),
    ]);

    return {
      categories,
      brands,
      priceRange: priceRange[0] ?? { min: 0, max: 100000 },
    };
  }
}

export const productService = new ProductService();
