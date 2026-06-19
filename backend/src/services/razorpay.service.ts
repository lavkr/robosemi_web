import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env';

interface CreateOrderOptions {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

interface CreateOrderResult {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

interface VerifyPaymentOptions {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID ?? '',
      key_secret: env.RAZORPAY_KEY_SECRET ?? '',
    });
  }

  async createOrder(options: CreateOrderOptions): Promise<CreateOrderResult> {
    const order = await this.razorpay.orders.create({
      amount: options.amount,
      currency: options.currency ?? 'INR',
      receipt: options.receipt,
      notes: options.notes,
    });
    return order as unknown as CreateOrderResult;
  }

  verifyPayment(options: VerifyPaymentOptions): boolean {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = options;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET ?? '')
      .update(body)
      .digest('hex');
    return expectedSignature === razorpay_signature;
  }

  async fetchPayment(paymentId: string): Promise<any> {
    return this.razorpay.payments.fetch(paymentId);
  }

  async initiateRefund(paymentId: string, amount?: number): Promise<any> {
    return this.razorpay.payments.refund(paymentId, {
      amount,
    });
  }
}

export const razorpayService = new RazorpayService();
