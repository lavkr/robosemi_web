import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { reviewRepository } from '../repositories/review.repository';
import { successResponse, errorResponse, paginatedResponse } from '../helpers/response';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const filters = {
      category: req.query.category as string,
      search: req.query.search as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      featured: req.query.featured === 'true' ? true : undefined,
      brand: req.query.brand as string,
      sort: req.query.sort as any,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Math.min(Number(req.query.limit), 100) : 20,
    };

    const { products, pagination } = await productService.getProducts(filters);
    paginatedResponse(res, products, pagination.total, pagination.page, pagination.limit);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }
    successResponse(res, product);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await productService.createProduct(req.body, req.user!.userId);
    successResponse(res, product, 'Product created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user!);
    successResponse(res, product, 'Product updated');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    await productService.deleteProduct(req.params.id, req.user!);
    successResponse(res, null, 'Product deleted');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function getProductFilters(req: Request, res: Response): Promise<void> {
  try {
    const filters = await productService.getProductFilters();
    successResponse(res, filters);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getProductReviews(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      reviewRepository.findByProduct(req.params.id, { skip, limit }),
      reviewRepository.count({ product: req.params.id }),
    ]);

    paginatedResponse(res, reviews, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}
