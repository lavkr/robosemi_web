import { Customer, Invoice, InvoiceCalculations, InvoiceItem, OverallDiscount, Product } from '@/types/billing.types';
import { format } from 'date-fns';

export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'CUST001',
    name: 'Acme Electronics Pvt Ltd',
    mobile: '+91 98765 43210',
    email: 'purchase@acme.com',
    billingAddress: '123 Industrial Area, Sector 18, Noida, UP - 201301',
    gstNumber: '09ABCDE1234F1Z5',
  },
  {
    id: 'CUST002',
    name: 'TechnoLab Solutions',
    mobile: '+91 87654 32109',
    email: 'orders@technolab.in',
    billingAddress: '45 Tech Park, Whitefield, Bengaluru, KA - 560066',
    gstNumber: '29FGHIJ5678K2A6',
  },
  {
    id: 'CUST003',
    name: 'Innovate Robotics',
    mobile: '+91 76543 21098',
    email: 'buy@innovaterobotics.com',
    billingAddress: '7 Maker Hub, Powai, Mumbai, MH - 400076',
    gstNumber: '27LMNOP9012L3B7',
  },
  {
    id: 'CUST004',
    name: 'Smart Automation India',
    mobile: '+91 65432 10987',
    email: 'procurement@smartauto.in',
    billingAddress: '22 Automation Street, Anna Nagar, Chennai, TN - 600040',
    gstNumber: '33QRSTU3456M4C8',
  },
  {
    id: 'CUST005',
    name: 'Deepak Sharma',
    mobile: '+91 99887 76655',
    email: 'deepak.sharma@gmail.com',
    billingAddress: '12 Shiv Colony, Rajouri Garden, New Delhi - 110027',
  },
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'PRD001',
    sku: 'RS-ARDU-UNO-R3',
    name: 'Arduino Uno R3 Microcontroller',
    category: 'Microcontrollers',
    unitPrice: 650,
    stock: { current: 150, available: 120, reserved: 30, reorderLevel: 20, warehouseLocation: 'A1-B3', status: 'in_stock' },
    gstRate: 18,
  },
  {
    id: 'PRD002',
    sku: 'RS-RASP-PI4-4G',
    name: 'Raspberry Pi 4 Model B (4GB RAM)',
    category: 'Single Board Computers',
    unitPrice: 5500,
    stock: { current: 45, available: 38, reserved: 7, reorderLevel: 10, warehouseLocation: 'A2-C1', status: 'in_stock' },
    gstRate: 18,
  },
  {
    id: 'PRD003',
    sku: 'RS-ESP32-DEVKIT',
    name: 'ESP32 Development Kit v1',
    category: 'Microcontrollers',
    unitPrice: 380,
    stock: { current: 200, available: 185, reserved: 15, reorderLevel: 30, warehouseLocation: 'A1-D2', status: 'in_stock' },
    gstRate: 18,
  },
  {
    id: 'PRD004',
    sku: 'RS-SENS-DHT22',
    name: 'DHT22 Temperature & Humidity Sensor',
    category: 'Sensors',
    unitPrice: 220,
    stock: { current: 8, available: 8, reserved: 0, reorderLevel: 15, warehouseLocation: 'B1-A4', status: 'low_stock' },
    gstRate: 12,
  },
  {
    id: 'PRD005',
    sku: 'RS-SERVO-SG90',
    name: 'SG90 Micro Servo Motor 9g',
    category: 'Actuators',
    unitPrice: 95,
    stock: { current: 0, available: 0, reserved: 0, reorderLevel: 25, warehouseLocation: 'C2-B1', status: 'out_of_stock' },
    gstRate: 18,
  },
  {
    id: 'PRD006',
    sku: 'RS-LIDAR-360-LD14',
    name: 'LD14 360° LiDAR Sensor',
    category: 'Sensors',
    unitPrice: 12500,
    stock: { current: 20, available: 17, reserved: 3, reorderLevel: 5, warehouseLocation: 'D1-A1', status: 'in_stock' },
    gstRate: 18,
  },
  {
    id: 'PRD007',
    sku: 'RS-STEPPER-NEMA17',
    name: 'NEMA 17 Stepper Motor 42mm',
    category: 'Actuators',
    unitPrice: 850,
    stock: { current: 75, available: 70, reserved: 5, reorderLevel: 15, warehouseLocation: 'C1-C3', status: 'in_stock' },
    gstRate: 18,
  },
  {
    id: 'PRD008',
    sku: 'RS-RELAY-4CH-5V',
    name: '4-Channel Relay Module 5V',
    category: 'Modules',
    unitPrice: 145,
    stock: { current: 12, available: 10, reserved: 2, reorderLevel: 20, warehouseLocation: 'B2-D1', status: 'low_stock' },
    gstRate: 18,
  },
  {
    id: 'PRD009',
    sku: 'RS-CAMERA-OV7670',
    name: 'OV7670 Camera Module VGA',
    category: 'Modules',
    unitPrice: 280,
    stock: { current: 60, available: 55, reserved: 5, reorderLevel: 10, warehouseLocation: 'B3-A2', status: 'in_stock' },
    gstRate: 18,
  },
  {
    id: 'PRD010',
    sku: 'RS-BATT-LIPO-3S',
    name: 'LiPo Battery 11.1V 2200mAh 3S',
    category: 'Power',
    unitPrice: 1250,
    stock: { current: 30, available: 25, reserved: 5, reorderLevel: 8, warehouseLocation: 'E1-B2', status: 'in_stock' },
    gstRate: 28,
  },
];

export function generateInvoiceNumber(): string {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${date}-${random}`;
}

export function calculateItemValues(item: Omit<InvoiceItem, 'subtotal' | 'discountAmount' | 'taxAmount' | 'total'>): InvoiceItem {
  const subtotal = item.unitPrice * item.quantity;
  const discountAmount =
    item.discount.type === 'percentage'
      ? subtotal * (item.discount.value / 100)
      : Math.min(item.discount.value, subtotal);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (item.gstRate / 100);
  const total = taxableAmount + taxAmount;

  return { ...item, subtotal, discountAmount, taxAmount, total };
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
  overallDiscount: OverallDiscount,
  couponDiscount: number,
  shippingCharge: number,
  paidAmount: number
): InvoiceCalculations {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemDiscount = items.reduce((sum, item) => sum + item.discountAmount, 0);
  const afterItemDiscount = subtotal - itemDiscount;

  const overallDiscountAmount =
    overallDiscount.type === 'percentage'
      ? afterItemDiscount * (overallDiscount.value / 100)
      : Math.min(overallDiscount.value, afterItemDiscount);

  const afterOverallDiscount = afterItemDiscount - overallDiscountAmount;
  const taxableAmount = afterOverallDiscount - couponDiscount;
  const gstAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);

  const grandTotalBeforeRoundOff = taxableAmount + gstAmount + shippingCharge;
  const grandTotal = Math.round(grandTotalBeforeRoundOff);
  const roundOff = grandTotal - grandTotalBeforeRoundOff;
  const dueAmount = Math.max(0, grandTotal - paidAmount);

  return {
    subtotal,
    itemDiscount,
    afterItemDiscount,
    overallDiscountAmount,
    afterOverallDiscount,
    couponDiscount,
    taxableAmount,
    gstAmount,
    shippingCharge,
    grandTotalBeforeRoundOff,
    roundOff,
    grandTotal,
    paidAmount,
    dueAmount,
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function createEmptyInvoice(): Invoice {
  const today = format(new Date(), 'yyyy-MM-dd');
  const dueDate = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  return {
    id: '',
    invoiceNumber: generateInvoiceNumber(),
    customer: null,
    items: [],
    invoiceDate: today,
    dueDate,
    salesPerson: '',
    notes: '',
    termsAndConditions: 'Payment due within 30 days. Goods once sold will not be returned. All disputes subject to local jurisdiction.',
    subtotal: 0,
    itemDiscount: 0,
    overallDiscount: { type: 'percentage', value: 0, amount: 0 },
    couponDiscount: 0,
    couponCode: '',
    shippingCharge: 0,
    gstAmount: 0,
    roundOff: 0,
    grandTotal: 0,
    paymentMethod: 'cash',
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: 'pending',
    status: 'draft',
  };
}
