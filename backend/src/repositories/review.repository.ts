import { FilterQuery, UpdateQuery } from 'mongoose';
import ReviewModel, { IReview } from '../models/Review.model';

export class ReviewRepository {
  async findById(id: string) {
    return ReviewModel.findById(id);
  }

  async findOne(filter: FilterQuery<IReview>) {
    return ReviewModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<IReview>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = ReviewModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<IReview>) {
    return ReviewModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<IReview>) {
    return ReviewModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return ReviewModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IReview>) {
    return ReviewModel.countDocuments(filter);
  }

  async findByProduct(
    productId: string,
    options?: { skip?: number; limit?: number; sort?: any },
  ) {
    let query: any = ReviewModel.find({ product: productId });
    if (options?.sort) query = query.sort(options.sort);
    else query = query.sort({ createdAt: -1 });
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    return query;
  }

  async updateHelpful(reviewId: string, email: string, increment: boolean) {
    if (increment) {
      return ReviewModel.findByIdAndUpdate(
        reviewId,
        { $inc: { helpful: 1 }, $addToSet: { helpfulBy: email } },
        { new: true },
      );
    } else {
      return ReviewModel.findByIdAndUpdate(
        reviewId,
        { $inc: { helpful: -1 }, $pull: { helpfulBy: email } },
        { new: true },
      );
    }
  }
}

export const reviewRepository = new ReviewRepository();
