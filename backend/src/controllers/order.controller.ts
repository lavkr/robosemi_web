import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { invoiceService } from '../services/invoice.service';
import { orderRepository } from '../repositories/order.repository';
import { successResponse, errorResponse, paginatedResponse } from '../helpers/response';

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const { orders, total } = await orderService.getUserOrders(
      req.user!.userId,
      req.user!.role,
      page,
      limit,
    );
    paginatedResponse(res, orders, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const order = await orderService.createOrder(req.user!.userId, req.body);
    successResponse(res, order, 'Order created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user!.userId, req.user!.role);
    successResponse(res, order);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 404);
  }
}

export async function cancelOrder(req: Request, res: Response): Promise<void> {
  try {
    const { reason, description } = req.body;
    const order = await orderService.cancelOrder(
      req.params.id,
      req.user!.userId,
      req.user!.role,
      reason,
      description,
    );
    successResponse(res, order, 'Order cancelled');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function requestReturn(req: Request, res: Response): Promise<void> {
  try {
    const { reason, description } = req.body;
    const order = await orderService.requestReturn(
      req.params.id,
      req.user!.userId,
      reason,
      description,
    );
    successResponse(res, order, 'Return request submitted');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function trackOrder(req: Request, res: Response): Promise<void> {
  try {
    const { orderNumber } = req.query;
    if (!orderNumber) {
      errorResponse(res, 'orderNumber is required', 400);
      return;
    }
    const order = await orderService.trackOrder(orderNumber as string);
    successResponse(res, order);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 404);
  }
}

export async function getInvoice(req: Request, res: Response): Promise<void> {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user!.userId, req.user!.role);
    const html = invoiceService.generateInvoiceHtml(order);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function checkPurchase(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.query;
    if (!productId) {
      errorResponse(res, 'productId is required', 400);
      return;
    }
    const order = await orderRepository.findOne({
      user: req.user!.userId,
      'items.product': productId,
      orderStatus: 'delivered',
    });
    successResponse(res, { hasPurchased: !!order });
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}
