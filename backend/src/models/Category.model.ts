import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const CategoryModel: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);
export default CategoryModel;
