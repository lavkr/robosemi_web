export interface ShippingRate {
  method: string;
  label: string;
  price: number;
  estimatedDays: number;
  description: string;
}

export interface CartItemWeight {
  weight?: number;
  quantity: number;
}

const DEFAULT_WEIGHT_PER_ITEM = 0.3; // kg
const FREE_SHIPPING_THRESHOLD = 999; // INR

export function calculateCartWeight(items: CartItemWeight[]): number {
  return items.reduce((total, item) => {
    const itemWeight = item.weight ?? DEFAULT_WEIGHT_PER_ITEM;
    return total + itemWeight * item.quantity;
  }, 0);
}

export function calculateShippingRates(
  cartTotal: number,
  weight: number,
  pincode?: string,
): ShippingRate[] {
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;

  const standardPrice = isFreeShipping ? 0 : weight <= 1 ? 49 : weight <= 5 ? 99 : 149;

  const rates: ShippingRate[] = [
    {
      method: 'standard',
      label: 'Standard Delivery',
      price: standardPrice,
      estimatedDays: 5,
      description: isFreeShipping ? 'Free shipping on orders above ₹999' : '3-7 business days',
    },
    {
      method: 'express',
      label: 'Express Delivery',
      price: weight <= 1 ? 99 : weight <= 5 ? 149 : 249,
      estimatedDays: 2,
      description: '1-3 business days',
    },
  ];

  // Check if COD is applicable (based on pincode or default)
  rates.push({
    method: 'cod',
    label: 'Cash on Delivery',
    price: standardPrice + 30,
    estimatedDays: 7,
    description: 'Pay when you receive. Additional ₹30 COD charge.',
  });

  return rates;
}

export function getDefaultShippingRate(cartTotal: number, weight: number): ShippingRate {
  const rates = calculateShippingRates(cartTotal, weight);
  return rates[0];
}

export function formatShippingStatus(status: string): string {
  const statusMap: Record<string, string> = {
    created: 'Order Created',
    assigned: 'Courier Assigned',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    returned: 'Returned',
    cancelled: 'Cancelled',
    // Shiprocket statuses
    PICKUP_SCHEDULED: 'Pickup Scheduled',
    PICKUP_GENERATED: 'Pickup Generated',
    READY_TO_SHIP: 'Ready to Ship',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELED: 'Cancelled',
    RTO_INITIATED: 'Return Initiated',
    RTO_DELIVERED: 'Return Completed',
    LOST: 'Lost in Transit',
    DAMAGED: 'Damaged',
  };

  return statusMap[status] ?? status;
}
