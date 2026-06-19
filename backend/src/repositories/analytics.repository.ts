import { FilterQuery, UpdateQuery } from 'mongoose';
import AnalyticsModel, { IAnalytics, AnalyticsEventType } from '../models/Analytics.model';

export class AnalyticsRepository {
  async findById(id: string) {
    return AnalyticsModel.findById(id);
  }

  async findOne(filter: FilterQuery<IAnalytics>) {
    return AnalyticsModel.findOne(filter);
  }

  async findMany(
    filter: FilterQuery<IAnalytics>,
    options?: { skip?: number; limit?: number; sort?: any; select?: string },
  ) {
    let query: any = AnalyticsModel.find(filter);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip !== undefined) query = query.skip(options.skip);
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.select) query = query.select(options.select);
    return query;
  }

  async create(data: Partial<IAnalytics>) {
    return AnalyticsModel.create(data);
  }

  async updateById(id: string, update: UpdateQuery<IAnalytics>) {
    return AnalyticsModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return AnalyticsModel.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IAnalytics>) {
    return AnalyticsModel.countDocuments(filter);
  }

  async trackEvent(data: Partial<IAnalytics>) {
    return AnalyticsModel.create(data);
  }

  async getEventsByType(type: AnalyticsEventType, from: Date, to: Date) {
    return AnalyticsModel.find({
      type,
      createdAt: { $gte: from, $lte: to },
    }).sort({ createdAt: -1 });
  }
}

export const analyticsRepository = new AnalyticsRepository();
