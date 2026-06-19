import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISellerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IBankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

export interface ISellerDocuments {
  panCard?: string;
  gstCertificate?: string;
  businessLicense?: string;
}

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  businessType: 'individual' | 'company' | 'partnership';
  gstNumber?: string;
  panNumber: string;
  businessAddress: ISellerAddress;
  bankDetails: IBankDetails;
  documents: ISellerDocuments;
  commission: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sellerSchema = new Schema<ISeller>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      enum: ['individual', 'company', 'partnership'],
      required: true,
    },
    gstNumber: { type: String },
    panNumber: { type: String, required: true },
    businessAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: 'India' },
    },
    bankDetails: {
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      accountHolderName: { type: String, required: true },
      bankName: { type: String, required: true },
    },
    documents: {
      panCard: { type: String },
      gstCertificate: { type: String },
      businessLicense: { type: String },
    },
    commission: { type: Number, default: 10, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const SellerModel: Model<ISeller> = mongoose.model<ISeller>('Seller', sellerSchema);
export default SellerModel;
