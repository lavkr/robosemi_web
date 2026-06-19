import { FilterQuery, UpdateQuery } from 'mongoose';
import RegistrationModel, { IRegistration } from '../models/Registration.model';

export class RegistrationRepository {
  async findById(id: string) {
    return RegistrationModel.findById(id).populate('trainingId');
  }

  async findOne(filter: FilterQuery<IRegistration>) {
    return RegistrationModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<IRegistration>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = RegistrationModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<IRegistration>) {
    return RegistrationModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<IRegistration>) {
    return RegistrationModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return RegistrationModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IRegistration>) {
    return RegistrationModel.countDocuments(filter);
  }
}

export const registrationRepository = new RegistrationRepository();
