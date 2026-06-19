import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISlide extends Document {
  desktoimage: string;
  mobileImage: string;
  link?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const slideSchema = new Schema<ISlide>(
  {
    desktoimage: { type: String, required: true },
    mobileImage: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

slideSchema.index({ _id: 1, isActive: 1 });

const SlideModel: Model<ISlide> = mongoose.model<ISlide>('Slide', slideSchema);
export default SlideModel;
