export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId?: string;
}

export interface OrderDto {
  _id: string;
  orderNumber: string;
  user: { _id: string; name: string; email: string };
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  couponCode?: string;
  notes?: string;
  cancellation?: {
    reason: string;
    description?: string;
    requestedAt: string;
    refundAmount?: number;
  };
  return?: {
    reason: string;
    description?: string;
    requestedAt: string;
    returnStatus: 'requested' | 'approved' | 'rejected' | 'completed';
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  items: Array<{ product: string; quantity: number; name?: string }>;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
  shippingCost?: number;
  tax?: number;
  total: number;
  discount?: number;
}
