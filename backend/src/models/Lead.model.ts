import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: 'website' | 'social' | 'email' | 'referral' | 'advertisement' | 'other';
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  status:
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'proposal'
    | 'negotiation'
    | 'closed_won'
    | 'closed_lost';
  score: number;
  interests: string[];
  notes: string;
  assignedTo?: mongoose.Types.ObjectId;
  lastContactedAt?: Date;
  convertedAt?: Date;
  value?: number;
  tags: string[];
  customFields?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String },
    company: { type: String },
    source: {
      type: String,
      enum: ['website', 'social', 'email', 'referral', 'advertisement', 'other'],
      required: true,
    },
    campaign: { type: String },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    utmTerm: { type: String },
    utmContent: { type: String },
    status: {
      type: String,
      enum: [
        'new',
        'contacted',
        'qualified',
        'proposal',
        'negotiation',
        'closed_won',
        'closed_lost',
      ],
      default: 'new',
    },
    score: { type: Number, default: 0, min: 0, max: 100 },
    interests: { type: [String], default: [] },
    notes: { type: String, default: '' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    lastContactedAt: { type: Date },
    convertedAt: { type: Date },
    value: { type: Number },
    tags: { type: [String], default: [] },
    customFields: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });

const LeadModel: Model<ILead> = mongoose.model<ILead>('Lead', leadSchema);
export default LeadModel;
