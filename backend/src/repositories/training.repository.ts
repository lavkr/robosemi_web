import { FilterQuery, UpdateQuery } from 'mongoose';
import TrainingModel, { ITraining } from '../models/Training.model';

export class TrainingRepository {
  async findById(id: string) {
    return TrainingModel.findById(id);
  }

  async findOne(filter: FilterQuery<ITraining>) {
    return TrainingModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<ITraining>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = TrainingModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<ITraining>) {
    return TrainingModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<ITraining>) {
    return TrainingModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return TrainingModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<ITraining>) {
    return TrainingModel.countDocuments(filter);
  }

  async findBySlug(slug: string) {
    return TrainingModel.findOne({ slug });
  }

  async incrementParticipants(id: string) {
    return TrainingModel.findByIdAndUpdate(
      id,
      { $inc: { currentParticipants: 1 } },
      { new: true },
    );
  }
}

export const trainingRepository = new TrainingRepository();
