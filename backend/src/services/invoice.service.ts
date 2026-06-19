import { IOrder } from '../models/Order.model';

export const CANCELLATION_REASONS = [
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'found_better_price', label: 'Found a better price elsewhere' },
  { value: 'wrong_item', label: 'Ordered wrong item' },
  { value: 'duplicate_order', label: 'Duplicate order' },
  { value: 'delivery_too_long', label: 'Delivery time is too long' },
  { value: 'other', label: 'Other' },
];

export const RETURN_REASONS = [
  { value: 'defective_product', label: 'Defective/damaged product' },
  { value: 'wrong_product', label: 'Wrong product received' },
  { value: 'not_as_described', label: 'Product not as described' },
  { value: 'missing_parts', label: 'Missing parts or accessories' },
  { value: 'quality_not_satisfactory', label: 'Quality not satisfactory' },
  { value: 'other', label: 'Other' },
];

class InvoiceService {
  generateInvoiceHtml(order: IOrder): string {
    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `,
      )
      .join('');

    const addr = order.shippingAddress;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #667eea; }
          .company-name { font-size: 24px; font-weight: bold; color: #667eea; }
          .invoice-title { font-size: 20px; font-weight: bold; text-align: right; }
          .invoice-number { color: #666; font-size: 14px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; font-size: 14px; color: #667eea; margin-bottom: 8px; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #667eea; color: white; padding: 10px; text-align: left; }
          th:last-child, th:nth-child(3) { text-align: right; }
          th:nth-child(2) { text-align: center; }
          .totals-row { text-align: right; padding: 5px 10px; }
          .grand-total { font-weight: bold; font-size: 18px; color: #667eea; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #d4edda; color: #155724; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="company-name">RoboSemi</div>
            <div style="color: #666; font-size: 13px;">Robotics & Electronics</div>
          </div>
          <div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">#${order.orderNumber}</div>
            <div class="invoice-number">Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div class="section">
            <div class="section-title">Ship To</div>
            <div>${addr.name}</div>
            <div>${addr.street}</div>
            <div>${addr.city}, ${addr.state} - ${addr.zipCode}</div>
            <div>${addr.country}</div>
            <div>Phone: ${addr.phone}</div>
          </div>
          <div class="section" style="text-align: right;">
            <div class="section-title">Order Details</div>
            <div>Order Status: <span class="status-badge">${order.orderStatus}</span></div>
            <div style="margin-top: 8px;">Payment: ${order.paymentMethod.toUpperCase()}</div>
            <div>Payment Status: ${order.paymentStatus}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="margin-top: 20px;">
          <table style="width: 300px; margin-left: auto;">
            <tr>
              <td class="totals-row">Subtotal:</td>
              <td class="totals-row">₹${order.subtotal.toFixed(2)}</td>
            </tr>
            ${order.discount > 0 ? `<tr><td class="totals-row">Discount:</td><td class="totals-row" style="color: green;">-₹${order.discount.toFixed(2)}</td></tr>` : ''}
            ${order.shippingCost > 0 ? `<tr><td class="totals-row">Shipping:</td><td class="totals-row">₹${order.shippingCost.toFixed(2)}</td></tr>` : '<tr><td class="totals-row">Shipping:</td><td class="totals-row" style="color: green;">FREE</td></tr>'}
            ${order.tax > 0 ? `<tr><td class="totals-row">Tax:</td><td class="totals-row">₹${order.tax.toFixed(2)}</td></tr>` : ''}
            <tr>
              <td class="totals-row grand-total">TOTAL:</td>
              <td class="totals-row grand-total">₹${order.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for your order! For support, contact us at support@robosemi.com</p>
          <p>© ${new Date().getFullYear()} RoboSemi. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }
}

export const invoiceService = new InvoiceService();
