import { FilterQuery, UpdateQuery } from 'mongoose';
import ProjectModel, { IProject } from '../models/Project.model';

export class ProjectRepository {
  async findById(id: string) {
    return ProjectModel.findById(id)
      .populate('category', 'name')
      .populate('products', 'name price images');
  }

  async findOne(filter: FilterQuery<IProject>) {
    return ProjectModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<IProject>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = ProjectModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<IProject>) {
    return ProjectModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<IProject>) {
    return ProjectModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return ProjectModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IProject>) {
    return ProjectModel.countDocuments(filter);
  }

  async findBySlug(slug: string) {
    return ProjectModel.findOne({ slug })
      .populate('category', 'name')
      .populate('products', 'name price images');
  }
}

export const projectRepository = new ProjectRepository();
