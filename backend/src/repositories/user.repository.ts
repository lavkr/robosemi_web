import { FilterQuery, UpdateQuery } from 'mongoose';
import UserModel, { IUser } from '../models/User.model';

export class UserRepository {
  async findById(id: string) {
    return UserModel.findById(id);
  }

  async findOne(filter: FilterQuery<IUser>) {
    return UserModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<IUser>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = UserModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<IUser>) {
    return UserModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<IUser>) {
    return UserModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return UserModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IUser>) {
    return UserModel.countDocuments(filter);
  }
}

export const userRepository = new UserRepository();
