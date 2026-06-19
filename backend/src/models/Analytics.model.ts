import mongoose, { Document, Schema, Model } from 'mongoose';

export type AnalyticsEventType =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'purchase'
  | 'search'
  | 'email_open'
  | 'email_click';

export interface IAnalytics extends Document {
  type: AnalyticsEventType;
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  productId?: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
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
  createdAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    type: {
      type: String,
      enum: [
        'page_view',
        'product_view',
        'add_to_cart',
        'purchase',
        'search',
        'email_open',
        'email_click',
      ],
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionId: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    page: { type: String },
    searchQuery: { type: String },
    value: { type: Number },
    metadata: { type: Schema.Types.Mixed },
    userAgent: { type: String, required: true },
    ipAddress: { type: String, required: true },
    referrer: { type: String },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    utmTerm: { type: String },
    utmContent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

analyticsSchema.index({ type: 1, createdAt: -1 });
analyticsSchema.index({ userId: 1, createdAt: -1 });
analyticsSchema.index({ sessionId: 1 });

const AnalyticsModel: Model<IAnalytics> = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
export default AnalyticsModel;
