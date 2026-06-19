import { FilterQuery, UpdateQuery } from 'mongoose';
import BlogModel, { IBlog } from '../models/Blog.model';

export class BlogRepository {
  async findById(id: string) {
    return BlogModel.findById(id).populate('author', 'name email avatar');
  }

  async findOne(filter: FilterQuery<IBlog>) {
    return BlogModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<IBlog>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = BlogModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<IBlog>) {
    return BlogModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<IBlog>) {
    return BlogModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return BlogModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IBlog>) {
    return BlogModel.countDocuments(filter);
  }

  async findBySlug(slug: string) {
    return BlogModel.findOne({ slug }).populate('author', 'name email avatar');
  }

  async findPublished(options?: { skip?: number; limit?: number; sort?: any }) {
    let query: any = BlogModel.find({ status: 'published' }).populate(
      'author',
      'name email avatar',
    );
    if (options?.sort) query = query.sort(options.sort);
    else query = query.sort({ publishedAt: -1 });
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    return query;
  }
}

export const blogRepository = new BlogRepository();
