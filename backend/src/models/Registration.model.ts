import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IRegistration extends Document {
  userName: string;
  userEmail: string;
  userPhone: string;
  trainingId: mongoose.Types.ObjectId;
  registeredAt: Date;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  amount: number;
  status: 'registered' | 'confirmed' | 'cancelled';
  notes?: string;
  college?: string;
  semester?: string;
  branch?: string;
  linkedin?: string;
  github?: string;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true, lowercase: true },
    userPhone: { type: String, required: true },
    trainingId: { type: Schema.Types.ObjectId, ref: 'Training', required: true },
    registeredAt: { type: Date, default: Date.now },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['registered', 'confirmed', 'cancelled'],
      default: 'registered',
    },
    notes: { type: String },
    college: { type: String },
    semester: { type: String },
    branch: { type: String },
    linkedin: { type: String },
    github: { type: String },
  },
  { timestamps: true },
);

registrationSchema.index({ userEmail: 1, trainingId: 1 }, { unique: true });

const RegistrationModel: Model<IRegistration> = mongoose.model<IRegistration>(
  'Registration',
  registrationSchema,
);
export default RegistrationModel;
