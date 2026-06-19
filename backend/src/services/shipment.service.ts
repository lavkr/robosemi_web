import { IOrder } from '../models/Order.model';
import { shiprocketService } from './shiprocket.service';
import { shipmentRepository } from '../repositories/shipment.repository';
import { env } from '../config/env';

class ShipmentService {
  async createShipment(order: IOrder): Promise<any> {
    try {
      const shippingAddr = order.shippingAddress;
      const firstItem = order.items[0];

      // Calculate total weight (approx 0.3kg per item if not specified)
      const totalWeight = order.items.reduce(
        (sum, item) => sum + 0.3 * item.quantity,
        0,
      );

      const shiprocketPayload = {
        order_id: order.orderNumber,
        order_date: new Date(order.createdAt).toISOString().split('T')[0],
        pickup_location: 'Primary',
        billing_customer_name: shippingAddr.name,
        billing_address: shippingAddr.street,
        billing_city: shippingAddr.city,
        billing_pincode: shippingAddr.zipCode,
        billing_state: shippingAddr.state,
        billing_country: shippingAddr.country,
        billing_email: '',
        billing_phone: shippingAddr.phone,
        shipping_is_billing: true,
        order_items: order.items.map((item) => ({
          name: item.name,
          sku: item.product.toString(),
          units: item.quantity,
          selling_price: item.price,
        })),
        payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
        sub_total: order.subtotal,
        length: 15,
        breadth: 15,
        height: 15,
        weight: Math.max(totalWeight, 0.3),
      };

      const shiprocketOrder = await shiprocketService.createOrder(shiprocketPayload);

      const shipment = await shipmentRepository.create({
        order: order._id as any,
        shiprocketOrderId: shiprocketOrder.order_id,
        shipmentId: shiprocketOrder.shipment_id,
        status: 'created',
        pickupLocation: {
          name: 'RoboSemi Warehouse',
          address: 'Default Warehouse',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: env.DEFAULT_PICKUP_PINCODE,
          phone: '9999999999',
        },
        deliveryLocation: {
          name: shippingAddr.name,
          address: shippingAddr.street,
          city: shippingAddr.city,
          state: shippingAddr.state,
          pincode: shippingAddr.zipCode,
          phone: shippingAddr.phone,
        },
        dimensions: {
          length: 15,
          breadth: 15,
          height: 15,
          weight: Math.max(totalWeight, 0.3),
        },
        shippingCharges: order.shippingCost,
        codCharges: order.paymentMethod === 'cod' ? 30 : 0,
      });

      return shipment;
    } catch (error) {
      console.error('Shipment creation failed:', error);
      throw error;
    }
  }
}

export const shipmentService = new ShipmentService();
