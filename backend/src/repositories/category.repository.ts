import { FilterQuery, UpdateQuery } from 'mongoose';
import CategoryModel, { ICategory } from '../models/Category.model';

export class CategoryRepository {
  async findById(id: string) {
    return CategoryModel.findById(id);
  }

  async findOne(filter: FilterQuery<ICategory>) {
    return CategoryModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<ICategory>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = CategoryModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<ICategory>) {
    return CategoryModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<ICategory>) {
    return CategoryModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return CategoryModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<ICategory>) {
    return CategoryModel.countDocuments(filter);
  }
}

export const categoryRepository = new CategoryRepository();
