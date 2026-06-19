import { FilterQuery, UpdateQuery } from 'mongoose';
import SlideModel, { ISlide } from '../models/Slide.model';

export class SlideRepository {
  async findById(id: string) {
    return SlideModel.findById(id);
  }

  async findOne(filter: FilterQuery<ISlide>) {
    return SlideModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<ISlide>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = SlideModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<ISlide>) {
    return SlideModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<ISlide>) {
    return SlideModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return SlideModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<ISlide>) {
    return SlideModel.countDocuments(filter);
  }

  async findActive() {
    return SlideModel.find({ isActive: true }).sort({ _id: 1 });
  }
}

export const slideRepository = new SlideRepository();
