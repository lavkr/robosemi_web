import { productRepository } from '../repositories/product.repository';
import { orderRepository } from '../repositories/order.repository';
import { generateOrderNumber } from '../utils/order-number';
import { shipmentService } from './shipment.service';
import { emailService, generateOrderConfirmationEmail } from './email.service';
import { userRepository } from '../repositories/user.repository';
import { IOrder } from '../models/Order.model';

export interface CreateOrderDto {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'razorpay' | 'cod';
  couponCode?: string;
  notes?: string;
  shippingCost?: number;
}

class OrderService {
  async createOrder(userId: string, orderData: CreateOrderDto): Promise<IOrder> {
    // Validate products and check stock
    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of orderData.items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        const err: any = new Error(`Product ${item.productId} not found`);
        err.statusCode = 404;
        throw err;
      }
      if (!product.isActive) {
        const err: any = new Error(`Product "${product.name}" is no longer available`);
        err.statusCode = 400;
        throw err;
      }
      if (product.stock < item.quantity) {
        const err: any = new Error(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        );
        err.statusCode = 400;
        throw err;
      }

      const finalPrice =
        product.discount && product.discount > 0
          ? product.price * (1 - product.discount / 100)
          : product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: finalPrice,
        quantity: item.quantity,
        image: product.images[0] ?? '',
        sellerId: product.sellerId,
      });

      subtotal += finalPrice * item.quantity;
    }

    const discount = 0; // Applied coupon discounts would reduce this
    const shippingCost = orderData.shippingCost ?? (subtotal >= 999 ? 0 : 49);
    const tax = 0;
    const total = subtotal - discount + shippingCost + tax;

    // Atomically decrement stock for each item
    for (const item of orderData.items) {
      await productRepository.updateStock(item.productId, -item.quantity);
    }

    const order = await orderRepository.create({
      orderNumber: generateOrderNumber(),
      user: userId as any,
      items: orderItems,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress ?? orderData.shippingAddress,
      subtotal,
      discount,
      shippingCost,
      tax,
      total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      couponCode: orderData.couponCode,
      notes: orderData.notes,
    });

    // Fire-and-forget: create shipment
    shipmentService.createShipment(order).catch((err) => {
      console.error('Shipment creation error (non-fatal):', err);
    });

    // Fire-and-forget: send confirmation email
    const user = await userRepository.findById(userId);
    if (user?.email) {
      emailService
        .sendEmail({
          to: user.email,
          subject: `Order Confirmed - ${order.orderNumber}`,
          html: generateOrderConfirmationEmail(order),
        })
        .catch((err) => console.error('Order email error (non-fatal):', err));
    }

    return order;
  }

  async getUserOrders(userId: string, role: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const filter = role === 'admin' || role === 'staff' ? {} : { user: userId };

    const [orders, total] = await Promise.all([
      orderRepository.findMany(filter, { skip, limit, sort: { createdAt: -1 } }),
      orderRepository.count(filter),
    ]);

    return { orders, total, page, limit };
  }

  async getOrderById(orderId: string, userId: string, role: string): Promise<IOrder> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    const isAdmin = role === 'admin' || role === 'staff';
    const isOwner = order.user.toString() === userId;

    if (!isAdmin && !isOwner) {
      const err: any = new Error('Access denied');
      err.statusCode = 403;
      throw err;
    }

    return order;
  }

  async cancelOrder(
    orderId: string,
    userId: string,
    role: string,
    reason: string,
    description?: string,
  ): Promise<IOrder> {
    const order = await this.getOrderById(orderId, userId, role);

    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      const err: any = new Error(
        `Cannot cancel order in "${order.orderStatus}" status`,
      );
      err.statusCode = 400;
      throw err;
    }

    // Restore stock
    for (const item of order.items) {
      await productRepository.updateStock(item.product.toString(), item.quantity);
    }

    const updated = await orderRepository.updateById(orderId, {
      orderStatus: 'cancelled',
      cancellation: {
        reason,
        description,
        requestedAt: new Date(),
      },
    });

    return updated!;
  }

  async requestReturn(
    orderId: string,
    userId: string,
    reason: string,
    description?: string,
  ): Promise<IOrder> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    if (order.user.toString() !== userId) {
      const err: any = new Error('Access denied');
      err.statusCode = 403;
      throw err;
    }

    if (order.orderStatus !== 'delivered') {
      const err: any = new Error('Only delivered orders can be returned');
      err.statusCode = 400;
      throw err;
    }

    const updated = await orderRepository.updateById(orderId, {
      orderStatus: 'returned',
      return: {
        reason,
        description,
        requestedAt: new Date(),
        returnStatus: 'requested',
      },
    });

    return updated!;
  }

  async trackOrder(orderNumber: string): Promise<IOrder> {
    const order = await orderRepository.findOne({ orderNumber });
    if (!order) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    return order;
  }
}

export const orderService = new OrderService();
