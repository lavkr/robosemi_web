import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { productRepository } from '../repositories/product.repository';
import { orderRepository } from '../repositories/order.repository';
import { sellerRepository } from '../repositories/seller.repository';
import { categoryRepository } from '../repositories/category.repository';
import { couponRepository } from '../repositories/coupon.repository';
import { slideRepository } from '../repositories/slide.repository';
import { registrationRepository } from '../repositories/registration.repository';
import { analyticsService } from '../services/analytics.service';
import { successResponse, errorResponse, paginatedResponse } from '../helpers/response';

export async function getAdminDashboard(req: Request, res: Response): Promise<void> {
  try {
    const [totalProducts, totalUsers, totalOrders, revenue, recentOrders] = await Promise.all([
      productRepository.count({}),
      userRepository.count({}),
      orderRepository.count({}),
      orderRepository.getRevenue({ paymentStatus: 'paid' }),
      orderRepository.findMany({}, { limit: 10, sort: { createdAt: -1 } }),
    ]);

    successResponse(res, {
      totalProducts,
      totalUsers,
      totalOrders,
      revenue,
      recentOrders,
    });
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      userRepository.findMany(filter, { skip, limit, sort: { createdAt: -1 } }),
      userRepository.count(filter),
    ]);

    paginatedResponse(res, users, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const updated = await userRepository.updateById(req.params.id, req.body);
    successResponse(res, updated, 'User updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getSellers(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter: any = req.query.status ? { status: req.query.status } : {};

    const [sellers, total] = await Promise.all([
      sellerRepository.findMany(filter, { skip, limit }),
      sellerRepository.count(filter),
    ]);

    paginatedResponse(res, sellers, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function updateSeller(req: Request, res: Response): Promise<void> {
  try {
    const updated = await sellerRepository.updateById(req.params.id, req.body);
    successResponse(res, updated, 'Seller updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await categoryRepository.findMany({});
    successResponse(res, categories);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const category = await categoryRepository.create(req.body);
    successResponse(res, category, 'Category created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const updated = await categoryRepository.updateById(req.params.id, req.body);
    successResponse(res, updated, 'Category updated');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    await categoryRepository.deleteById(req.params.id);
    successResponse(res, null, 'Category deleted');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  try {
    const order = await orderRepository.findById(req.params.id);
    if (!order) {
      errorResponse(res, 'Order not found', 404);
      return;
    }
    successResponse(res, order);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const updated = await orderRepository.updateById(req.params.id, req.body);
    successResponse(res, updated, 'Order updated');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function getCoupons(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      couponRepository.findMany({}, { skip, limit }),
      couponRepository.count({}),
    ]);

    paginatedResponse(res, coupons, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createCoupon(req: Request, res: Response): Promise<void> {
  try {
    const coupon = await couponRepository.create(req.body);
    successResponse(res, coupon, 'Coupon created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function updateCoupon(req: Request, res: Response): Promise<void> {
  try {
    const updated = await couponRepository.updateById(req.params.id, req.body);
    successResponse(res, updated, 'Coupon updated');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function deleteCoupon(req: Request, res: Response): Promise<void> {
  try {
    await couponRepository.deleteById(req.params.id);
    successResponse(res, null, 'Coupon deleted');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function getAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const days = Number(req.query.days) || 30;
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);

    const stats = await analyticsService.getDashboardStats(from, to);
    successResponse(res, stats);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getRegistrations(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      registrationRepository.findMany({}, { skip, limit, sort: { createdAt: -1 } }),
      registrationRepository.count({}),
    ]);

    paginatedResponse(res, registrations, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getSlides(req: Request, res: Response): Promise<void> {
  try {
    const slides = await slideRepository.findMany({});
    successResponse(res, slides);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createSlide(req: Request, res: Response): Promise<void> {
  try {
    const slide = await slideRepository.create(req.body);
    successResponse(res, slide, 'Slide created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function updateSlide(req: Request, res: Response): Promise<void> {
  try {
    const updated = await slideRepository.updateById(req.params.id, req.body);
    successResponse(res, updated, 'Slide updated');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function deleteSlide(req: Request, res: Response): Promise<void> {
  try {
    await slideRepository.deleteById(req.params.id);
    successResponse(res, null, 'Slide deleted');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}
