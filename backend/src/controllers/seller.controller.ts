import { Request, Response } from 'express';
import { sellerRepository } from '../repositories/seller.repository';
import { productRepository } from '../repositories/product.repository';
import { orderRepository } from '../repositories/order.repository';
import { couponRepository } from '../repositories/coupon.repository';
import { reviewRepository } from '../repositories/review.repository';
import { successResponse, errorResponse, paginatedResponse } from '../helpers/response';

async function getSellerForUser(userId: string) {
  const seller = await sellerRepository.findByUserId(userId);
  if (!seller) {
    const err: any = new Error('Seller profile not found');
    err.statusCode = 404;
    throw err;
  }
  if (seller.status !== 'approved') {
    const err: any = new Error('Seller account is not approved');
    err.statusCode = 403;
    throw err;
  }
  return seller;
}

export async function getSellerDashboard(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const sellerId = (seller as any)._id.toString();

    const [totalProducts, totalOrders, revenue, recentOrders] = await Promise.all([
      productRepository.count({ sellerId }),
      orderRepository.count({ 'items.sellerId': sellerId }),
      orderRepository.getRevenue({ 'items.sellerId': sellerId, paymentStatus: 'paid' }),
      orderRepository.findBySeller(sellerId, { limit: 5 }),
    ]);

    successResponse(res, { totalProducts, totalOrders, revenue, recentOrders });
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function getSellerProducts(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      productRepository.findMany({ sellerId: (seller as any)._id }, { skip, limit }),
      productRepository.count({ sellerId: (seller as any)._id }),
    ]);

    paginatedResponse(res, products, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function createSellerProduct(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const product = await productRepository.create({
      ...req.body,
      createdBy: req.user!.userId as any,
      sellerId: (seller as any)._id,
    });
    successResponse(res, product, 'Product created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function updateSellerProduct(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const product = await productRepository.findById(req.params.id);

    if (!product || product.sellerId?.toString() !== (seller as any)._id.toString()) {
      errorResponse(res, 'Product not found or not yours', 404);
      return;
    }

    const updated = await productRepository.updateById(req.params.id, req.body);
    successResponse(res, updated, 'Product updated');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function deleteSellerProduct(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const product = await productRepository.findById(req.params.id);

    if (!product || product.sellerId?.toString() !== (seller as any)._id.toString()) {
      errorResponse(res, 'Product not found or not yours', 404);
      return;
    }

    await productRepository.deleteById(req.params.id);
    successResponse(res, null, 'Product deleted');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function getSellerOrders(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderRepository.findBySeller((seller as any)._id.toString(), { skip, limit }),
      orderRepository.count({ 'items.sellerId': (seller as any)._id }),
    ]);

    paginatedResponse(res, orders, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function getSellerAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const sellerId = (seller as any)._id;

    const revenue = await orderRepository.getRevenue({
      'items.sellerId': sellerId,
      paymentStatus: 'paid',
    });

    successResponse(res, { revenue });
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function getSellerInventory(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const products = await productRepository.findMany({
      sellerId: (seller as any)._id,
      $expr: { $lte: ['$stock', '$minStock'] },
    });

    successResponse(res, products, 'Low stock products');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function getSellerReviews(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const products = await productRepository.findMany(
      { sellerId: (seller as any)._id },
      { select: '_id' },
    );
    const productIds = products.map((p: any) => p._id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      reviewRepository.findMany({ product: { $in: productIds } }, { skip, limit }),
      reviewRepository.count({ product: { $in: productIds } }),
    ]);

    paginatedResponse(res, reviews, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function getSellerProfile(req: Request, res: Response): Promise<void> {
  try {
    const seller = await sellerRepository.findByUserId(req.user!.userId);
    successResponse(res, seller);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function updateSellerProfile(req: Request, res: Response): Promise<void> {
  try {
    const seller = await sellerRepository.findByUserId(req.user!.userId);
    if (!seller) {
      errorResponse(res, 'Seller not found', 404);
      return;
    }
    const updated = await sellerRepository.updateById((seller as any)._id.toString(), req.body);
    successResponse(res, updated, 'Profile updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getSellerCoupons(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const coupons = await couponRepository.findMany({ sellerId: (seller as any)._id });
    successResponse(res, coupons);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function createSellerCoupon(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const coupon = await couponRepository.create({
      ...req.body,
      sellerId: (seller as any)._id,
    });
    successResponse(res, coupon, 'Coupon created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function updateSellerCoupon(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const coupon = await couponRepository.findById(req.params.id);

    if (!coupon || coupon.sellerId?.toString() !== (seller as any)._id.toString()) {
      errorResponse(res, 'Coupon not found or not yours', 404);
      return;
    }

    const updated = await couponRepository.updateById(req.params.id, req.body);
    successResponse(res, updated, 'Coupon updated');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function deleteSellerCoupon(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const coupon = await couponRepository.findById(req.params.id);

    if (!coupon || coupon.sellerId?.toString() !== (seller as any)._id.toString()) {
      errorResponse(res, 'Coupon not found or not yours', 404);
      return;
    }

    await couponRepository.deleteById(req.params.id);
    successResponse(res, null, 'Coupon deleted');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function getSellerShipping(req: Request, res: Response): Promise<void> {
  try {
    successResponse(res, { message: 'Shipping info for seller' });
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getTopSellerProducts(req: Request, res: Response): Promise<void> {
  try {
    const seller = await getSellerForUser(req.user!.userId);
    const products = await productRepository.findMany(
      { sellerId: (seller as any)._id, isActive: true },
      { limit: 10, sort: { reviewCount: -1, rating: -1 } },
    );
    successResponse(res, products, 'Top products');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}
