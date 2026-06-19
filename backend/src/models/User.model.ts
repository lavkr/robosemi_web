import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  addedAt: Date;
}

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface INotifications {
  emailOrders: boolean;
  emailPromotions: boolean;
  emailNewsletter: boolean;
  smsOrders: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  oauthProvider?: string;
  role: 'user' | 'admin' | 'staff' | 'seller';
  phone?: string;
  avatar?: string;
  addresses: IAddress[];
  cart: ICartItem[];
  wishlist: IWishlistItem[];
  notifications: INotifications;
  isActive: boolean;
  emailVerified: boolean;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    type: { type: String, enum: ['home', 'work', 'other'], required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const wishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6 },
    oauthProvider: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin', 'staff', 'seller'],
      default: 'user',
    },
    phone: { type: String },
    avatar: { type: String },
    addresses: { type: [addressSchema], default: [] },
    cart: { type: [cartItemSchema], default: [] },
    wishlist: { type: [wishlistItemSchema], default: [] },
    notifications: {
      emailOrders: { type: Boolean, default: true },
      emailPromotions: { type: Boolean, default: false },
      emailNewsletter: { type: Boolean, default: false },
      smsOrders: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre<IUser>('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// Remove password from JSON output
userSchema.set('toJSON', {
  transform(_doc, ret) {
    ret['password'] = undefined as any;
    return ret;
  },
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default UserModel;
