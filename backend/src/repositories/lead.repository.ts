import { FilterQuery, UpdateQuery } from 'mongoose';
import LeadModel, { ILead } from '../models/Lead.model';

export class LeadRepository {
  async findById(id: string) {
    return LeadModel.findById(id);
  }

  async findOne(filter: FilterQuery<ILead>) {
    return LeadModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<ILead>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = LeadModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<ILead>) {
    return LeadModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<ILead>) {
    return LeadModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return LeadModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<ILead>) {
    return LeadModel.countDocuments(filter);
  }
}

export const leadRepository = new LeadRepository();
