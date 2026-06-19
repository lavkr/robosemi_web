import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  name?: string;
  source: string;
  interests: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  customFields?: Record<string, unknown>;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  lastEmailSent?: Date;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String },
    source: { type: String, required: true },
    interests: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['active', 'unsubscribed', 'bounced'],
      default: 'active',
    },
    tags: { type: [String], default: [] },
    customFields: { type: Schema.Types.Mixed },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
    lastEmailSent: { type: Date },
    emailsSent: { type: Number, default: 0 },
    emailsOpened: { type: Number, default: 0 },
    emailsClicked: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const NewsletterModel: Model<INewsletter> = mongoose.model<INewsletter>(
  'Newsletter',
  newsletterSchema,
);
export default NewsletterModel;
