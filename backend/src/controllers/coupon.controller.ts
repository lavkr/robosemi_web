import { Request, Response } from 'express';
import { couponRepository } from '../repositories/coupon.repository';
import { successResponse, errorResponse } from '../helpers/response';

export async function validateCoupon(req: Request, res: Response): Promise<void> {
  try {
    const { code, orderTotal } = req.body;

    const coupon = await couponRepository.findByCode(code);
    if (!coupon) {
      errorResponse(res, 'Invalid coupon code', 404, 'COUPON_NOT_FOUND');
      return;
    }

    if (!coupon.isActive) {
      errorResponse(res, 'Coupon is inactive', 400, 'COUPON_INACTIVE');
      return;
    }

    if (new Date() > coupon.expiresAt) {
      errorResponse(res, 'Coupon has expired', 400, 'COUPON_EXPIRED');
      return;
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      errorResponse(res, 'Coupon usage limit reached', 400, 'COUPON_LIMIT_REACHED');
      return;
    }

    if (orderTotal < coupon.minOrderValue) {
      errorResponse(
        res,
        `Minimum order value of ₹${coupon.minOrderValue} required`,
        400,
        'MIN_ORDER_NOT_MET',
      );
      return;
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderTotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }

    successResponse(res, {
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
      discount: Math.round(discount),
    });
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}
