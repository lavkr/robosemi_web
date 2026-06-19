import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    products: { type: [Schema.Types.ObjectId], ref: 'Product', default: [] },
  },
  { timestamps: true },
);

const WishlistModel: Model<IWishlist> = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
export default WishlistModel;
