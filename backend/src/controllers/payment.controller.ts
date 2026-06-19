import { Request, Response } from 'express';
import { razorpayService } from '../services/razorpay.service';
import { orderRepository } from '../repositories/order.repository';
import { successResponse, errorResponse } from '../helpers/response';

export async function createPaymentOrder(req: Request, res: Response): Promise<void> {
  try {
    const { amount, orderId, currency } = req.body;

    const razorpayOrder = await razorpayService.createOrder({
      amount: Math.round(amount * 100), // convert to paise
      currency: currency ?? 'INR',
      receipt: orderId,
    });

    successResponse(res, razorpayOrder, 'Payment order created');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const isValid = razorpayService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      errorResponse(res, 'Payment verification failed', 400, 'PAYMENT_INVALID');
      return;
    }

    // Update order payment status
    if (orderId) {
      await orderRepository.updateById(orderId, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        orderStatus: 'confirmed',
      });
    }

    successResponse(res, { verified: true, paymentId: razorpay_payment_id }, 'Payment verified');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}
