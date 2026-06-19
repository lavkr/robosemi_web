import { Request, Response } from 'express';
import { reviewRepository } from '../repositories/review.repository';
import { orderRepository } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';
import { successResponse, errorResponse, paginatedResponse } from '../helpers/response';

export async function getReviews(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.query;
    if (!productId) {
      errorResponse(res, 'productId is required', 400);
      return;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      reviewRepository.findByProduct(productId as string, { skip, limit }),
      reviewRepository.count({ product: productId }),
    ]);

    paginatedResponse(res, reviews, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createReview(req: Request, res: Response): Promise<void> {
  try {
    const { productId, rating, comment } = req.body;

    // Check if user purchased this product
    const purchaseOrder = await orderRepository.findOne({
      user: req.user!.userId,
      'items.product': productId,
      orderStatus: 'delivered',
    });

    if (!purchaseOrder) {
      errorResponse(res, 'You can only review products you have purchased and received', 403, 'PURCHASE_REQUIRED');
      return;
    }

    // Check if already reviewed
    const existingReview = await reviewRepository.findOne({
      product: productId,
      'user.email': req.user!.email,
    });

    if (existingReview) {
      errorResponse(res, 'You have already reviewed this product', 409, 'ALREADY_REVIEWED');
      return;
    }

    const review = await reviewRepository.create({
      product: productId,
      user: { name: req.user!.name, email: req.user!.email },
      rating,
      comment,
    });

    // Update product rating
    const allReviews = await reviewRepository.findMany({ product: productId });
    const avgRating =
      allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;

    await productRepository.updateById(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    successResponse(res, review, 'Review submitted', 201);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function toggleHelpful(req: Request, res: Response): Promise<void> {
  try {
    const review = await reviewRepository.findById(req.params.id);
    if (!review) {
      errorResponse(res, 'Review not found', 404);
      return;
    }

    const email = req.user!.email;
    const alreadyVoted = review.helpfulBy.includes(email);

    const updated = await reviewRepository.updateHelpful(req.params.id, email, !alreadyVoted);
    successResponse(res, updated, alreadyVoted ? 'Vote removed' : 'Marked as helpful');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}
