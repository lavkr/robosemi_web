import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  helpful: number;
  helpfulBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    helpful: { type: Number, default: 0 },
    helpfulBy: { type: [String], default: [] },
  },
  { timestamps: true },
);

const ReviewModel: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);
export default ReviewModel;
