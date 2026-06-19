import { FilterQuery, UpdateQuery } from 'mongoose';
import OrderModel, { IOrder } from '../models/Order.model';

export class OrderRepository {
  async findById(id: string) {
    return OrderModel.findById(id).populate('user', 'name email phone');
  }

  async findOne(filter: FilterQuery<IOrder>) {
    return OrderModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<IOrder>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = OrderModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<IOrder>) {
    return OrderModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<IOrder>) {
    return OrderModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return OrderModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IOrder>) {
    return OrderModel.countDocuments(filter);
  }

  async findByUser(
    userId: string,
    options?: { skip?: number; limit?: number; sort?: any },
  ) {
    let query: any = OrderModel.find({ user: userId });
    if (options?.sort) query = query.sort(options.sort);
    else query = query.sort({ createdAt: -1 });
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    return query;
  }

  async findBySeller(
    sellerId: string,
    options?: { skip?: number; limit?: number; sort?: any },
  ) {
    let query: any = OrderModel.find({ 'items.sellerId': sellerId });
    if (options?.sort) query = query.sort(options.sort);
    else query = query.sort({ createdAt: -1 });
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    return query;
  }

  async getRevenue(filter: FilterQuery<IOrder>): Promise<number> {
    const result = await OrderModel.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    return result[0]?.total ?? 0;
  }
}

export const orderRepository = new OrderRepository();
