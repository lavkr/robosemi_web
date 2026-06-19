import { analyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsEventType, IAnalytics } from '../models/Analytics.model';

interface TrackEventOptions {
  type: AnalyticsEventType;
  userId?: string;
  sessionId: string;
  productId?: string;
  orderId?: string;
  page?: string;
  searchQuery?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  userAgent: string;
  ipAddress: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

class AnalyticsService {
  async trackEvent(options: TrackEventOptions): Promise<IAnalytics> {
    return analyticsRepository.trackEvent(options as any);
  }

  async getPageViews(from: Date, to: Date) {
    return analyticsRepository.getEventsByType('page_view', from, to);
  }

  async getProductViews(from: Date, to: Date) {
    return analyticsRepository.getEventsByType('product_view', from, to);
  }

  async getPurchases(from: Date, to: Date) {
    return analyticsRepository.getEventsByType('purchase', from, to);
  }

  async getSearchEvents(from: Date, to: Date) {
    return analyticsRepository.getEventsByType('search', from, to);
  }

  async getDashboardStats(from: Date, to: Date) {
    const [pageViews, productViews, purchases, searches, addToCarts] = await Promise.all([
      analyticsRepository.count({ type: 'page_view', createdAt: { $gte: from, $lte: to } }),
      analyticsRepository.count({ type: 'product_view', createdAt: { $gte: from, $lte: to } }),
      analyticsRepository.count({ type: 'purchase', createdAt: { $gte: from, $lte: to } }),
      analyticsRepository.count({ type: 'search', createdAt: { $gte: from, $lte: to } }),
      analyticsRepository.count({ type: 'add_to_cart', createdAt: { $gte: from, $lte: to } }),
    ]);

    return {
      pageViews,
      productViews,
      purchases,
      searches,
      addToCarts,
      period: { from, to },
    };
  }

  async getTopSearchQueries(from: Date, to: Date, limit = 10) {
    const { default: AnalyticsModel } = await import('../models/Analytics.model');
    return AnalyticsModel.aggregate([
      {
        $match: {
          type: 'search',
          searchQuery: { $exists: true, $ne: '' },
          createdAt: { $gte: from, $lte: to },
        },
      },
      { $group: { _id: '$searchQuery', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
  }
}

export const analyticsService = new AnalyticsService();
