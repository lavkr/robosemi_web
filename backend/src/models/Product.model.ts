import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IDimensions {
  length: number;
  width: number;
  height: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  minStock: number;
  specifications?: Record<string, unknown>;
  tags: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: IDimensions;
  seoTitle?: string;
  seoDescription?: string;
  createdBy: mongoose.Types.ObjectId;
  sellerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    subcategory: { type: String },
    brand: { type: String, required: true },
    sku: { type: String, required: true, unique: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    minStock: { type: Number, default: 5 },
    specifications: { type: Schema.Types.Mixed },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    seoTitle: { type: String },
    seoDescription: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller' },
  },
  { timestamps: true },
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

const ProductModel: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
export default ProductModel;
