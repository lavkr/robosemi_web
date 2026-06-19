import { Request, Response } from 'express';
import { calculateShippingRates } from '../services/shipping.service';
import { shiprocketService } from '../services/shiprocket.service';
import { successResponse, errorResponse } from '../helpers/response';

export async function getShippingRates(req: Request, res: Response): Promise<void> {
  try {
    const { cartTotal, weight, pincode } = req.query;
    const rates = calculateShippingRates(
      Number(cartTotal) || 0,
      Number(weight) || 0.5,
      pincode as string,
    );
    successResponse(res, rates);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function checkServiceability(req: Request, res: Response): Promise<void> {
  try {
    const { pincode, weight = '0.5', cod = 'false' } = req.query;
    if (!pincode) {
      errorResponse(res, 'pincode is required', 400);
      return;
    }
    const result = await shiprocketService.getServiceability(
      process.env.DEFAULT_PICKUP_PINCODE || '400001',
      pincode as string,
      Number(weight),
      cod === 'true',
    );
    successResponse(res, result);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function trackShipment(req: Request, res: Response): Promise<void> {
  try {
    const { awb } = req.params;
    const result = await shiprocketService.trackOrder(awb);
    successResponse(res, result);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}
