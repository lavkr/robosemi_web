export type DiscountType = 'percentage' | 'fixed';
export type PaymentMethod = 'cash' | 'upi' | 'credit_card' | 'debit_card' | 'net_banking';
export type PaymentStatus = 'paid' | 'partial' | 'pending';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  billingAddress: string;
  gstNumber?: string;
}

export interface ProductStock {
  current: number;
  available: number;
  reserved: number;
  reorderLevel: number;
  warehouseLocation: string;
  status: StockStatus;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  stock: ProductStock;
  gstRate: number;
}

export interface Discount {
  type: DiscountType;
  value: number;
}

export interface InvoiceItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: Discount;
  gstRate: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

export interface OverallDiscount extends Discount {
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: Customer | null;
  items: InvoiceItem[];
  invoiceDate: string;
  dueDate: string;
  salesPerson: string;
  notes: string;
  termsAndConditions: string;
  subtotal: number;
  itemDiscount: number;
  overallDiscount: OverallDiscount;
  couponDiscount: number;
  couponCode: string;
  shippingCharge: number;
  gstAmount: number;
  roundOff: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  status: InvoiceStatus;
}

export interface InvoiceCalculations {
  subtotal: number;
  itemDiscount: number;
  afterItemDiscount: number;
  overallDiscountAmount: number;
  afterOverallDiscount: number;
  couponDiscount: number;
  taxableAmount: number;
  gstAmount: number;
  shippingCharge: number;
  grandTotalBeforeRoundOff: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  totalItems: number;
  totalQuantity: number;
}
