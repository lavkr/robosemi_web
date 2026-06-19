import { FilterQuery, UpdateQuery } from 'mongoose';
import ProductModel, { IProduct } from '../models/Product.model';

export class ProductRepository {
  async findById(id: string) {
    return ProductModel.findById(id);
  }

  async findOne(filter: FilterQuery<IProduct>) {
    return ProductModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<IProduct>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = ProductModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<IProduct>) {
    return ProductModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<IProduct>) {
    return ProductModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return ProductModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IProduct>) {
    return ProductModel.countDocuments(filter);
  }

  async findByCategory(
    category: string,
    options?: { skip?: number; limit?: number; sort?: any },
  ) {
    let query: any = ProductModel.find({ category, isActive: true });
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    return query;
  }

  async searchProducts(
    searchQuery: string,
    options?: { skip?: number; limit?: number; sort?: any },
  ) {
    let query: any = ProductModel.find(
      { $text: { $search: searchQuery }, isActive: true },
      { score: { $meta: 'textScore' } },
    );
    if (options?.sort) {
      query = query.sort(options.sort);
    } else {
      query = query.sort({ score: { $meta: 'textScore' } });
    }
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    return query;
  }

  async updateStock(id: string, delta: number) {
    return ProductModel.findByIdAndUpdate(
      id,
      { $inc: { stock: delta } },
      { new: true },
    );
  }
}

export const productRepository = new ProductRepository();
