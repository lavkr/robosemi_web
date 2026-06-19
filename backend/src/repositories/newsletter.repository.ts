import { FilterQuery, UpdateQuery } from 'mongoose';
import NewsletterModel, { INewsletter } from '../models/Newsletter.model';

export class NewsletterRepository {
  async findById(id: string) {
    return NewsletterModel.findById(id);
  }

  async findOne(filter: FilterQuery<INewsletter>) {
    return NewsletterModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<INewsletter>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = NewsletterModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<INewsletter>) {
    return NewsletterModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<INewsletter>) {
    return NewsletterModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return NewsletterModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<INewsletter>) {
    return NewsletterModel.countDocuments(filter);
  }
}

export const newsletterRepository = new NewsletterRepository();
