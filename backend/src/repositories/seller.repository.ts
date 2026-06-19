import { FilterQuery, UpdateQuery } from 'mongoose';
import SellerModel, { ISeller } from '../models/Seller.model';

export class SellerRepository {
  async findById(id: string) {
    return SellerModel.findById(id);
  }

  async findOne(filter: FilterQuery<ISeller>) {
    return SellerModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<ISeller>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = SellerModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<ISeller>) {
    return SellerModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<ISeller>) {
    return SellerModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return SellerModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<ISeller>) {
    return SellerModel.countDocuments(filter);
  }

  async findByUserId(userId: string) {
    return SellerModel.findOne({ userId });
  }

  async findByStatus(
    status: string,
    options?: { skip?: number; limit?: number; sort?: any },
  ) {
    let query: any = SellerModel.find({ status });
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    return query;
  }
}

export const sellerRepository = new SellerRepository();
