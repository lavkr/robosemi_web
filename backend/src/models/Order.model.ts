import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId?: mongoose.Types.ObjectId;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ICancellation {
  reason: string;
  description?: string;
  requestedAt: Date;
  processedAt?: Date;
  refundAmount?: number;
}

export interface IReturn {
  reason: string;
  description?: string;
  requestedAt: Date;
  processedAt?: Date;
  refundAmount?: number;
  returnStatus: 'requested' | 'approved' | 'rejected' | 'completed';
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  billingAddress: IShippingAddress;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  orderStatus:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';
  trackingNumber?: string;
  couponCode?: string;
  notes?: string;
  cancellation?: ICancellation;
  return?: IReturn;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller' },
  },
  { _id: false },
);

const addressSchema = new Schema<IShippingAddress>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema, required: true },
    subtotal: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: { type: String },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
      ],
      default: 'pending',
    },
    trackingNumber: { type: String },
    couponCode: { type: String },
    notes: { type: String },
    cancellation: {
      reason: { type: String },
      description: { type: String },
      requestedAt: { type: Date },
      processedAt: { type: Date },
      refundAmount: { type: Number },
    },
    return: {
      reason: { type: String },
      description: { type: String },
      requestedAt: { type: Date },
      processedAt: { type: Date },
      refundAmount: { type: Number },
      returnStatus: {
        type: String,
        enum: ['requested', 'approved', 'rejected', 'completed'],
      },
    },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

const OrderModel: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);
export default OrderModel;
