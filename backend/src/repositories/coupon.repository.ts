import { FilterQuery, UpdateQuery } from 'mongoose';
import CouponModel, { ICoupon } from '../models/Coupon.model';

export class CouponRepository {
  async findById(id: string) {
    return CouponModel.findById(id);
  }

  async findOne(filter: FilterQuery<ICoupon>) {
    return CouponModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<ICoupon>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = CouponModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<ICoupon>) {
    return CouponModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<ICoupon>) {
    return CouponModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return CouponModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<ICoupon>) {
    return CouponModel.countDocuments(filter);
  }

  async findByCode(code: string) {
    return CouponModel.findOne({ code: code.toUpperCase() });
  }

  async incrementUsed(code: string) {
    return CouponModel.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } },
      { new: true },
    );
  }
}

export const couponRepository = new CouponRepository();
