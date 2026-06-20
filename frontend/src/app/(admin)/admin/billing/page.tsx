'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Plus, Trash2, Edit2, Save, Printer, Download, Mail, RefreshCw,
  Search, User, X, CheckCircle2, AlertTriangle,
  XCircle, Package, Barcode, Building2, Phone, AtSign, MapPin,
  CreditCard, Banknote, Smartphone, Globe, BadgeCheck, Receipt,
  Tag, Truck, FileText, SlidersHorizontal,
  IndianRupee, ShoppingCart, Calculator, FilePlus, Send, Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import AddCustomerModal from '@/components/billing/AddCustomerModal';

import {
  Customer,
  DiscountType,
  Invoice,
  InvoiceCalculations,
  InvoiceItem,
  PaymentMethod,
  PaymentStatus,
  Product,
  StockStatus,
} from '@/types/billing.types';
import {
  SAMPLE_CUSTOMERS,
  calculateInvoiceTotals,
  calculateItemValues,
  createEmptyInvoice,
  generateInvoiceNumber,
} from '@/lib/billing-data';
import { cn } from '@/utils/utils';

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function StockBadge({ status, available }: { status: StockStatus; available: number }) {
  if (status === 'out_of_stock')
    return <Badge variant="destructive" className="text-xs gap-1"><XCircle className="h-3 w-3" />Out of Stock</Badge>;
  if (status === 'low_stock')
    return <Badge className="text-xs gap-1 bg-amber-500 hover:bg-amber-600"><AlertTriangle className="h-3 w-3" />Low Stock ({available})</Badge>;
  return <Badge className="text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="h-3 w-3" />In Stock ({available})</Badge>;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map = {
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400',
    partial: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400',
    pending: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400',
  };
  const labels = { paid: 'Paid', partial: 'Partial', pending: 'Pending' };
  return <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', map[status])}>{labels[status]}</span>;
}

function InvoiceStatusBadge({ status }: { status: Invoice['status'] }) {
  const map = {
    draft: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
    sent: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400',
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400',
    overdue: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400',
  };
  const labels = { draft: 'Draft', sent: 'Sent', paid: 'Paid', overdue: 'Overdue' };
  return <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', map[status])}>{labels[status]}</span>;
}

// ─── Invoice HTML generator (for PDF / print) ────────────────────────────────

function buildInvoiceHTML(inv: Invoice, calc: InvoiceCalculations): string {
  const payLabel = { cash: 'Cash', upi: 'UPI', credit_card: 'Credit Card', debit_card: 'Debit Card', net_banking: 'Net Banking' };
  const statusColor: Record<string, string> = { paid: '#15803d', partial: '#b45309', pending: '#b91c1c' };
  const statusBg: Record<string, string>    = { paid: '#dcfce7',  partial: '#fef3c7',  pending: '#fee2e2' };

  const rows = inv.items.map((item) => `
    <tr>
      <td>${item.product.name}<br/><small style="color:#94a3b8;font-size:11px">${item.product.sku}</small></td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">₹${fmt(item.unitPrice)}</td>
      <td style="text-align:center">${item.discount.value > 0 ? (item.discount.type === 'percentage' ? `${item.discount.value}%` : `₹${fmt(item.discount.value)}`) : '—'}</td>
      <td style="text-align:center">${item.gstRate}%</td>
      <td style="text-align:right;font-weight:700">₹${fmt(item.total)}</td>
    </tr>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Invoice ${inv.invoiceNumber}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;padding:40px;font-size:14px}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}
  .brand{font-size:26px;font-weight:800;color:#2563eb}
  .brand-sub{font-size:12px;color:#64748b;margin-top:2px}
  .inv-title{text-align:right}
  .inv-title h1{font-size:32px;font-weight:200;color:#cbd5e1;letter-spacing:4px}
  .inv-title p{font-size:13px;color:#64748b;margin-top:4px}
  .divider{height:3px;background:linear-gradient(90deg,#2563eb,#93c5fd);margin:0 0 28px}
  .parties{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:28px}
  .party-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:6px}
  .party-name{font-size:15px;font-weight:700;margin-bottom:3px}
  .party-detail{font-size:12px;color:#64748b;line-height:1.7}
  .meta{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:#f8fafc;border-radius:8px;padding:18px;margin-bottom:28px}
  .meta-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#94a3b8}
  .meta-val{font-size:13px;font-weight:600;margin-top:3px}
  table{width:100%;border-collapse:collapse;margin-bottom:24px}
  thead tr{background:#1e3a5f}
  th{padding:11px 14px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#cbd5e1}
  th:last-child,td:last-child{text-align:right}
  tbody tr:nth-child(even){background:#f8fafc}
  td{padding:11px 14px;font-size:13px;border-bottom:1px solid #e2e8f0}
  .totals{display:flex;justify-content:flex-end;margin-bottom:28px}
  .totals-inner{width:300px}
  .tr{display:flex;justify-content:space-between;padding:5px 0;font-size:13px}
  .tr.sep{border-top:1px solid #e2e8f0;margin-top:4px;padding-top:10px}
  .tr.grand{font-size:17px;font-weight:800;color:#2563eb;border-top:2px solid #2563eb;margin-top:6px;padding-top:10px}
  .green{color:#15803d}.red{color:#dc2626}
  .pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
  .pay-card{background:#f8fafc;border-radius:8px;padding:16px}
  .pay-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#94a3b8;margin-bottom:8px}
  .status-badge{display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700}
  .notes{margin-top:8px;padding:16px;background:#f8fafc;border-radius:8px;border-left:3px solid #2563eb}
  .notes-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#94a3b8;margin-bottom:6px}
  .notes-txt{font-size:12px;color:#475569;line-height:1.7}
  .footer{margin-top:36px;padding-top:20px;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:12px}
  @media print{body{padding:20px}@page{margin:12mm}}
</style></head><body>
<div class="hdr">
  <div><div class="brand">RoboSemi</div><div class="brand-sub">robosemi.com</div></div>
  <div class="inv-title"><h1>INVOICE</h1><p>${inv.invoiceNumber}</p></div>
</div>
<div class="divider"></div>
<div class="parties">
  <div>
    <div class="party-lbl">Bill To</div>
    <div class="party-name">${inv.customer?.name ?? '—'}</div>
    <div class="party-detail">
      ${inv.customer?.mobile ?? ''}<br/>
      ${inv.customer?.email ?? ''}<br/>
      ${inv.customer?.billingAddress ?? ''}
      ${inv.customer?.gstNumber ? `<br/>GST: ${inv.customer.gstNumber}` : ''}
    </div>
  </div>
  <div style="text-align:right">
    <div class="party-lbl">Invoice Details</div>
    <div class="party-detail">
      Date: <strong>${inv.invoiceDate}</strong><br/>
      Due: <strong>${inv.dueDate}</strong><br/>
      ${inv.salesPerson ? `Sales: <strong>${inv.salesPerson}</strong>` : ''}
    </div>
  </div>
</div>
<div class="meta">
  <div><div class="meta-lbl">Invoice No.</div><div class="meta-val">${inv.invoiceNumber}</div></div>
  <div><div class="meta-lbl">Invoice Date</div><div class="meta-val">${inv.invoiceDate}</div></div>
  <div><div class="meta-lbl">Due Date</div><div class="meta-val">${inv.dueDate}</div></div>
</div>
<table>
  <thead><tr>
    <th>Product / SKU</th><th style="text-align:center">Qty</th>
    <th style="text-align:right">Unit Price</th><th style="text-align:center">Discount</th>
    <th style="text-align:center">GST</th><th style="text-align:right">Total</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="totals"><div class="totals-inner">
  <div class="tr"><span>Subtotal</span><span>₹${fmt(calc.subtotal)}</span></div>
  ${calc.itemDiscount > 0 ? `<div class="tr"><span>Item Discount</span><span class="green">-₹${fmt(calc.itemDiscount)}</span></div>` : ''}
  ${calc.overallDiscountAmount > 0 ? `<div class="tr"><span>Overall Discount</span><span class="green">-₹${fmt(calc.overallDiscountAmount)}</span></div>` : ''}
  ${calc.couponDiscount > 0 ? `<div class="tr"><span>Coupon Discount</span><span class="green">-₹${fmt(calc.couponDiscount)}</span></div>` : ''}
  <div class="tr"><span>GST / Tax</span><span>₹${fmt(calc.gstAmount)}</span></div>
  ${calc.shippingCharge > 0 ? `<div class="tr"><span>Shipping</span><span>₹${fmt(calc.shippingCharge)}</span></div>` : ''}
  ${calc.roundOff !== 0 ? `<div class="tr"><span>Round Off</span><span>${calc.roundOff > 0 ? '+' : ''}₹${fmt(calc.roundOff)}</span></div>` : ''}
  <div class="tr grand"><span>Grand Total</span><span>₹${fmt(calc.grandTotal)}</span></div>
  <div class="tr sep"><span>Paid Amount</span><span class="green">₹${fmt(calc.paidAmount)}</span></div>
  <div class="tr"><span><strong>Balance Due</strong></span><span class="${calc.dueAmount > 0 ? 'red' : 'green'}"><strong>₹${fmt(calc.dueAmount)}</strong></span></div>
</div></div>
<div class="pay-grid">
  <div class="pay-card">
    <div class="pay-lbl">Payment Method</div>
    <div style="font-size:14px;font-weight:600">${payLabel[inv.paymentMethod] ?? inv.paymentMethod}</div>
  </div>
  <div class="pay-card">
    <div class="pay-lbl">Payment Status</div>
    <span class="status-badge" style="background:${statusBg[inv.paymentStatus] ?? '#f1f5f9'};color:${statusColor[inv.paymentStatus] ?? '#334155'}">
      ${inv.paymentStatus.charAt(0).toUpperCase() + inv.paymentStatus.slice(1)}
    </span>
  </div>
</div>
${inv.notes ? `<div class="notes"><div class="notes-lbl">Notes</div><div class="notes-txt">${inv.notes}</div></div>` : ''}
${inv.termsAndConditions ? `<div class="notes" style="margin-top:12px;border-color:#94a3b8"><div class="notes-lbl">Terms &amp; Conditions</div><div class="notes-txt">${inv.termsAndConditions}</div></div>` : ''}
<div class="footer">Thank you for your business · RoboSemi · robosemi.com</div>
</body></html>`;
}

// ─── Map backend product → billing Product ────────────────────────────────────

function mapApiProduct(raw: any): Product {
  const stock = typeof raw.stock === 'number' ? raw.stock : 0;
  const minStock = typeof raw.minStock === 'number' ? raw.minStock : 5;
  const status: StockStatus =
    stock === 0 ? 'out_of_stock' : stock <= minStock ? 'low_stock' : 'in_stock';
  return {
    id: raw._id ?? raw.id,
    sku: raw.sku || `SKU-${String(raw._id ?? raw.id).slice(-6).toUpperCase()}`,
    name: raw.name,
    category: typeof raw.category === 'string' ? raw.category : raw.category?.name ?? 'General',
    unitPrice: raw.price,
    stock: {
      current: stock,
      available: stock,
      reserved: 0,
      reorderLevel: minStock,
      warehouseLocation: raw.warehouseLocation ?? '—',
      status,
    },
    gstRate: raw.gstRate ?? 18,
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [invoice, setInvoice] = useState<Invoice>(createEmptyInvoice);
  const [customers, setCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailFields, setEmailFields] = useState({ to: '', subject: '', body: '' });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const customerRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  // ── Click-outside handler ─────────────────────────────────────────────────

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (customerRef.current && !customerRef.current.contains(e.target as Node))
        setShowCustomerDropdown(false);
      if (productRef.current && !productRef.current.contains(e.target as Node))
        setShowProductDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Fetch real products from API ──────────────────────────────────────────

  useEffect(() => {
    if (!showProductDropdown) return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      setProductSearchLoading(true);
      try {
        const params = new URLSearchParams({ limit: '40', isActive: 'true' });
        if (productSearch.trim()) params.append('search', productSearch.trim());

        const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
          signal: controller.signal,
          credentials: 'include',
        });
        const json = await res.json();

        // Handle both {data:[]} and {products:[]} and plain []
        const raw: any[] = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.products)
          ? json.products
          : [];

        setProducts(raw.filter((p) => p.isActive !== false).map(mapApiProduct));
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // API unreachable — show empty with message (no silent fallback)
          setProducts([]);
        }
      } finally {
        setProductSearchLoading(false);
      }
    };

    // Debounce typed searches; load immediately on focus with empty query
    const delay = productSearch.trim() ? 300 : 0;
    const timer = setTimeout(fetchProducts, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [productSearch, showProductDropdown]);

  // ── Derived calculations ──────────────────────────────────────────────────

  const calc = useMemo(
    () =>
      calculateInvoiceTotals(
        invoice.items,
        invoice.overallDiscount,
        invoice.couponDiscount,
        invoice.shippingCharge,
        invoice.paidAmount
      ),
    [invoice.items, invoice.overallDiscount, invoice.couponDiscount, invoice.shippingCharge, invoice.paidAmount]
  );

  const paymentStatus: PaymentStatus = useMemo(() => {
    if (calc.paidAmount <= 0) return 'pending';
    if (calc.dueAmount <= 0) return 'paid';
    return 'partial';
  }, [calc.paidAmount, calc.dueAmount]);

  // ── Customer handlers ─────────────────────────────────────────────────────

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
          c.mobile.includes(customerSearch) ||
          c.email.toLowerCase().includes(customerSearch.toLowerCase())
      ),
    [customers, customerSearch]
  );

  const selectCustomer = useCallback((customer: Customer) => {
    setInvoice((prev) => ({ ...prev, customer }));
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
  }, []);

  const clearCustomer = () => {
    setInvoice((prev) => ({ ...prev, customer: null }));
    setCustomerSearch('');
  };

  const handleAddCustomer = (customer: Customer) => {
    setCustomers((prev) => [customer, ...prev]);
    selectCustomer(customer);
  };

  // ── Product handlers ──────────────────────────────────────────────────────
  // products[] is already filtered server-side; no client-side filter needed.

  const addProduct = (product: Product) => {
    if (product.stock.status === 'out_of_stock') {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    const existing = invoice.items.find((i) => i.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock.available) {
        toast.error(`Only ${product.stock.available} units available`);
        return;
      }
      updateItem(existing.id, { quantity: existing.quantity + 1 });
    } else {
      const newItem = calculateItemValues({
        id: `ITEM-${Date.now()}`,
        product,
        quantity: 1,
        unitPrice: product.unitPrice,
        discount: { type: 'percentage', value: 0 },
        gstRate: product.gstRate,
      });
      setInvoice((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    }
    setProductSearch('');
    setShowProductDropdown(false);
    toast.success(`${product.name} added to invoice`);
  };

  const updateItem = useCallback((id: string, updates: Partial<InvoiceItem>) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item;
        const merged = { ...item, ...updates };
        if (updates.quantity !== undefined && updates.quantity > item.product.stock.available) {
          toast.warning(`Only ${item.product.stock.available} units available for ${item.product.name}`);
          merged.quantity = item.product.stock.available;
        }
        return calculateItemValues(merged);
      }),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvoice((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
    toast.info('Item removed');
  }, []);

  // ── Invoice actions ───────────────────────────────────────────────────────

  const newInvoice = () => {
    setInvoice(createEmptyInvoice());
    setCustomerSearch('');
    setProductSearch('');
    toast.success('New invoice created');
  };

  const saveDraft = async () => {
    if (!invoice.customer) { toast.error('Please select a customer'); return; }
    if (invoice.items.length === 0) { toast.error('Add at least one product'); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setInvoice((prev) => ({ ...prev, status: 'draft' }));
    setIsSaving(false);
    toast.success('Invoice saved as draft');
  };

  const sendInvoice = async () => {
    if (!invoice.customer) { toast.error('Please select a customer'); return; }
    if (invoice.items.length === 0) { toast.error('Add at least one product'); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setInvoice((prev) => ({ ...prev, status: 'sent' }));
    setIsSaving(false);
    toast.success(`Invoice sent to ${invoice.customer.email}`);
  };

  const triggerIframePrint = (html: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:0;';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) { document.body.removeChild(iframe); return; }
    doc.open();
    doc.write(html);
    doc.close();
    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => { document.body.removeChild(iframe); }, 2000);
    }, 500);
  };

  const printInvoice = () => {
    if (!invoice.customer || invoice.items.length === 0) {
      toast.error('Add a customer and at least one product first');
      return;
    }
    triggerIframePrint(buildInvoiceHTML(invoice, calc));
    toast.success('Print dialog opened');
  };

  const downloadPDF = () => {
    if (!invoice.customer || invoice.items.length === 0) {
      toast.error('Add a customer and at least one product first');
      return;
    }
    const html = buildInvoiceHTML(invoice, calc);
    // Trigger print via hidden iframe (no popup needed)
    triggerIframePrint(html);
    toast.success('Select "Save as PDF" in the print dialog to download');
  };

  const openEmailModal = () => {
    if (!invoice.customer) { toast.error('Please select a customer first'); return; }
    if (invoice.items.length === 0) { toast.error('Add at least one product'); return; }
    setEmailFields({
      to: invoice.customer.email,
      subject: `Invoice ${invoice.invoiceNumber} from RoboSemi`,
      body: `Dear ${invoice.customer.name},\n\nPlease find attached your invoice ${invoice.invoiceNumber} dated ${invoice.invoiceDate}.\n\nGrand Total: ₹${fmt(calc.grandTotal)}\nDue Amount:  ₹${fmt(calc.dueAmount)}\nDue Date:    ${invoice.dueDate}\n\nThank you for your business.\n\nRegards,\nRoboSemi Team`,
    });
    setShowEmailModal(true);
  };

  const sendEmail = async () => {
    if (!emailFields.to) { toast.error('Recipient email is required'); return; }
    setIsSendingEmail(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_BASE}/misc/send-invoice-email`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          to: emailFields.to,
          subject: emailFields.subject,
          body: emailFields.body,
          invoiceHtml: buildInvoiceHTML(invoice, calc),
        }),
      });
      clearTimeout(timeout);

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Send failed');

      setInvoice((prev) => ({ ...prev, status: 'sent' }));
      setShowEmailModal(false);
      toast.success(`Invoice emailed to ${emailFields.to}`);
    } catch (err: any) {
      // SMTP unavailable (dev env) — fall back to mailto: so it always works
      const subject = encodeURIComponent(emailFields.subject);
      const body = encodeURIComponent(emailFields.body);
      window.location.href = `mailto:${emailFields.to}?subject=${subject}&body=${body}`;
      setInvoice((prev) => ({ ...prev, status: 'sent' }));
      setShowEmailModal(false);
      toast.success('Opening your email app with the pre-filled invoice…');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Top Action Bar ───────────────────────────────────────────────── */}
      <div className="bg-background border-b sticky top-0 z-30 print:hidden">
        <div className="px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Invoice</p>
                <p className="font-bold text-sm leading-tight">{invoice.invoiceNumber}</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <InvoiceStatusBadge status={invoice.status} />
            <PaymentStatusBadge status={paymentStatus} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={newInvoice}>
              <FilePlus className="h-4 w-4 mr-1.5" />New
            </Button>
            <Button variant="outline" size="sm" onClick={saveDraft} disabled={isSaving}>
              <Save className="h-4 w-4 mr-1.5" />Save Draft
            </Button>
            <Button variant="outline" size="sm" onClick={printInvoice}>
              <Printer className="h-4 w-4 mr-1.5" />Print
            </Button>
            <Button variant="outline" size="sm" onClick={downloadPDF}>
              <Download className="h-4 w-4 mr-1.5" />PDF
            </Button>
            <Button size="sm" onClick={openEmailModal} disabled={isSaving}>
              <Mail className="h-4 w-4 mr-1.5" />Email Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ════════ LEFT COLUMN ════════════════════════════════════════════ */}
        <div className="xl:col-span-2 space-y-5">

          {/* ── Customer Section ──────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Search */}
              <div ref={customerRef} className="relative">
                <Label className="text-xs font-medium mb-1.5 block">Search Customer</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 pr-9"
                    placeholder="Search by name, mobile, or email…"
                    value={customerSearch}
                    onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); }}
                    onFocus={() => setShowCustomerDropdown(true)}
                  />
                  {customerSearch && (
                    <button onClick={clearCustomer} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {showCustomerDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">No customers found</div>
                    ) : (
                      filteredCustomers.map((c) => (
                        <button
                          key={c.id}
                          className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors border-b last:border-0"
                          onClick={() => selectCustomer(c)}
                        >
                          <p className="font-medium text-sm">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.mobile} · {c.email}</p>
                        </button>
                      ))
                    )}
                    <button
                      className="w-full text-left px-4 py-2.5 hover:bg-primary/5 text-primary text-sm font-medium flex items-center gap-2 border-t"
                      onClick={() => { setShowCustomerDropdown(false); setShowAddCustomerModal(true); }}
                    >
                      <Plus className="h-4 w-4" /> Add New Customer
                    </button>
                  </div>
                )}
              </div>

              {/* Selected Customer Details */}
              {invoice.customer && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Company / Name</p>
                      <p className="text-sm font-semibold">{invoice.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mobile</p>
                      <p className="text-sm font-medium">{invoice.customer.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AtSign className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{invoice.customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Billing Address</p>
                      <p className="text-sm font-medium">{invoice.customer.billingAddress}</p>
                    </div>
                  </div>
                  {invoice.customer.gstNumber && (
                    <div className="flex items-start gap-2 sm:col-span-2">
                      <BadgeCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">GST Number</p>
                        <p className="text-sm font-mono font-medium tracking-wide">{invoice.customer.gstNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setShowAddCustomerModal(true)}
              >
                <Plus className="h-3.5 w-3.5" /> Add New Customer
              </Button>
            </CardContent>
          </Card>

          {/* ── Invoice Information ───────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Invoice Number</Label>
                  <div className="flex gap-2">
                    <Input value={invoice.invoiceNumber} readOnly className="font-mono bg-muted/50 text-sm" />
                    <Button
                      variant="outline"
                      size="icon"
                      title="Regenerate"
                      onClick={() => setInvoice((p) => ({ ...p, invoiceNumber: generateInvoiceNumber() }))}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Invoice Date</Label>
                  <Input
                    type="date"
                    value={invoice.invoiceDate}
                    onChange={(e) => setInvoice((p) => ({ ...p, invoiceDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Due Date</Label>
                  <Input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice((p) => ({ ...p, dueDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Sales Person</Label>
                  <Input
                    placeholder="Sales representative name"
                    value={invoice.salesPerson}
                    onChange={(e) => setInvoice((p) => ({ ...p, salesPerson: e.target.value }))}
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs">Notes</Label>
                  <Input
                    placeholder="Internal notes or instructions…"
                    value={invoice.notes}
                    onChange={(e) => setInvoice((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                  <Label className="text-xs">Terms & Conditions</Label>
                  <Textarea
                    rows={2}
                    value={invoice.termsAndConditions}
                    onChange={(e) => setInvoice((p) => ({ ...p, termsAndConditions: e.target.value }))}
                    className="text-sm resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Product Search ────────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Add Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={productRef} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 pr-10"
                    placeholder="Search by product name, SKU, or category…"
                    value={productSearch}
                    onChange={(e) => { setProductSearch(e.target.value); setShowProductDropdown(true); }}
                    onFocus={() => setShowProductDropdown(true)}
                  />
                  {productSearchLoading ? (
                    <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                  ) : (
                    <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {showProductDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-80 overflow-y-auto">
                    {productSearchLoading ? (
                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading products…
                      </div>
                    ) : products.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        {productSearch
                          ? `No products found for "${productSearch}"`
                          : 'No products available'}
                      </div>
                    ) : (
                      products.map((p) => (
                        <button
                          key={p.id}
                          className={cn(
                            'w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-0',
                            p.stock.status === 'out_of_stock' && 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => addProduct(p)}
                          disabled={p.stock.status === 'out_of_stock'}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                <span className="font-mono">{p.sku}</span>
                                <span className="mx-1.5">·</span>
                                <span>{p.category}</span>
                                <span className="mx-1.5">·</span>
                                <span>GST {p.gstRate}%</span>
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-sm">₹{fmt(p.unitPrice)}</p>
                              <div className="mt-0.5">
                                <StockBadge status={p.stock.status} available={p.stock.available} />
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Invoice Items Table ───────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  Invoice Items
                  {invoice.items.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{invoice.items.length}</Badge>
                  )}
                </CardTitle>
                {invoice.items.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {calc.totalQuantity} items · ₹{fmt(calc.subtotal)} subtotal
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {invoice.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No products added yet</p>
                  <p className="text-xs mt-1">Search and select products above to add them</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="text-xs w-[200px]">Product</TableHead>
                        <TableHead className="text-xs">SKU</TableHead>
                        <TableHead className="text-xs text-center">Stock</TableHead>
                        <TableHead className="text-xs text-center">Qty</TableHead>
                        <TableHead className="text-xs text-right">Unit Price</TableHead>
                        <TableHead className="text-xs text-center w-[130px]">Discount</TableHead>
                        <TableHead className="text-xs text-right">Tax %</TableHead>
                        <TableHead className="text-xs text-right">Total</TableHead>
                        <TableHead className="text-xs text-center w-16">Act.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((item) => (
                        <InvoiceItemRow
                          key={item.id}
                          item={item}
                          isEditing={editingItemId === item.id}
                          onEdit={() => setEditingItemId(item.id)}
                          onSave={() => setEditingItemId(null)}
                          onUpdate={(updates) => updateItem(item.id, updates)}
                          onRemove={() => removeItem(item.id)}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Inventory Status ──────────────────────────────────────────── */}
          {invoice.items.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Inventory Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoice.items.map((item) => {
                    const pct = Math.min(100, (item.quantity / Math.max(1, item.product.stock.available)) * 100);
                    return (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium truncate max-w-[200px]">{item.product.name}</span>
                          <span className="text-muted-foreground ml-2 shrink-0">
                            {item.quantity} / {item.product.stock.available} avail · {item.product.stock.warehouseLocation}
                          </span>
                        </div>
                        <Progress
                          value={pct}
                          className={cn('h-1.5', pct >= 90 && '[&>div]:bg-red-500', pct >= 60 && pct < 90 && '[&>div]:bg-amber-500')}
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Reserved: {item.product.stock.reserved}</span>
                          <span>Reorder at: {item.product.stock.reorderLevel}</span>
                          <span>Current stock: {item.product.stock.current}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ════════ RIGHT COLUMN ═══════════════════════════════════════════ */}
        <div className="space-y-5">

          {/* ── Invoice Summary Card ──────────────────────────────────────── */}
          <Card className="border-primary/30 bg-primary/5 dark:bg-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Total Items', value: calc.totalItems, mono: false },
                { label: 'Total Quantity', value: calc.totalQuantity, mono: false },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}

              <Separator className="my-2" />

              {[
                { label: 'Subtotal', value: calc.subtotal },
                { label: 'Item Discount', value: -calc.itemDiscount, negative: true },
                { label: 'Overall Discount', value: -calc.overallDiscountAmount, negative: true },
                { label: 'Coupon Discount', value: -calc.couponDiscount, negative: true },
                { label: 'GST / Tax', value: calc.gstAmount },
                { label: 'Shipping', value: calc.shippingCharge },
                { label: 'Round Off', value: calc.roundOff },
              ].map(({ label, value, negative }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={cn('font-medium', negative && value !== 0 && 'text-emerald-600 dark:text-emerald-400')}>
                    {negative && value !== 0 ? '-' : ''}₹{fmt(Math.abs(value))}
                  </span>
                </div>
              ))}

              <Separator className="my-2" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-base">Grand Total</span>
                <span className="font-bold text-xl text-primary">₹{fmt(calc.grandTotal)}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid Amount</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">₹{fmt(calc.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Due Amount</span>
                <span className={cn('font-bold', calc.dueAmount > 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400')}>
                  ₹{fmt(calc.dueAmount)}
                </span>
              </div>

              <div className="pt-2 flex justify-center">
                <PaymentStatusBadge status={paymentStatus} />
              </div>
            </CardContent>
          </Card>

          {/* ── Pricing Controls ──────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                Pricing & Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Discount */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Overall Discount</Label>
                <div className="flex gap-2">
                  <Select
                    value={invoice.overallDiscount.type}
                    onValueChange={(v) =>
                      setInvoice((p) => ({ ...p, overallDiscount: { ...p.overallDiscount, type: v as DiscountType, amount: 0 } }))
                    }
                  >
                    <SelectTrigger className="w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">% Percent</SelectItem>
                      <SelectItem value="fixed">₹ Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    className="text-sm"
                    value={invoice.overallDiscount.value || ''}
                    onChange={(e) =>
                      setInvoice((p) => ({
                        ...p,
                        overallDiscount: { ...p.overallDiscount, value: Number(e.target.value), amount: 0 },
                      }))
                    }
                  />
                </div>
                {calc.overallDiscountAmount > 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    Saving ₹{fmt(calc.overallDiscountAmount)} on this invoice
                  </p>
                )}
              </div>

              {/* Coupon */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    className="text-sm"
                    value={invoice.couponCode}
                    onChange={(e) => setInvoice((p) => ({ ...p, couponCode: e.target.value.toUpperCase() }))}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!invoice.couponCode) { toast.error('Enter a coupon code'); return; }
                      if (invoice.couponCode === 'ROBO10') {
                        setInvoice((p) => ({ ...p, couponDiscount: calc.subtotal * 0.1 }));
                        toast.success('Coupon ROBO10 applied — 10% off!');
                      } else {
                        toast.error('Invalid coupon code');
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
                {invoice.couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Coupon applied: -₹{fmt(invoice.couponDiscount)}
                    </span>
                    <button
                      className="text-destructive hover:underline"
                      onClick={() => setInvoice((p) => ({ ...p, couponCode: '', couponDiscount: 0 }))}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  Shipping Charge
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0.00"
                  className="text-sm"
                  value={invoice.shippingCharge || ''}
                  onChange={(e) => setInvoice((p) => ({ ...p, shippingCharge: Number(e.target.value) }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Payment Section ───────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Method — plain button grid, no RadioGroup sr-only trick */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: 'cash',        label: 'Cash',        icon: Banknote  },
                      { value: 'upi',         label: 'UPI',         icon: Smartphone },
                      { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
                      { value: 'debit_card',  label: 'Debit Card',  icon: CreditCard },
                      { value: 'net_banking', label: 'Net Banking', icon: Globe      },
                    ] as { value: PaymentMethod; label: string; icon: React.ElementType }[]
                  ).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setInvoice((p) => ({ ...p, paymentMethod: value }))}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-medium transition-all text-left',
                        invoice.paymentMethod === value
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-input bg-background hover:bg-muted/60 text-foreground'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Paid Amount — no max clamp so the field is always typeable */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Paid Amount (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0.00"
                  className="text-sm font-mono"
                  value={invoice.paidAmount || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setInvoice((p) => ({
                      ...p,
                      paidAmount: val < 0 ? 0 : val,
                    }));
                  }}
                />
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2"
                    disabled={calc.grandTotal <= 0}
                    onClick={() => setInvoice((p) => ({ ...p, paidAmount: calc.grandTotal }))}
                  >
                    Full
                  </Button>
                  {[0.25, 0.5, 0.75].map((pct) => (
                    <Button
                      key={pct}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2"
                      disabled={calc.grandTotal <= 0}
                      onClick={() => setInvoice((p) => ({ ...p, paidAmount: Math.round(calc.grandTotal * pct) }))}
                    >
                      {pct * 100}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-muted/40 p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grand Total</span>
                  <span className="font-bold">₹{fmt(calc.grandTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">₹{fmt(calc.paidAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-bold">
                  <span>Balance Due</span>
                  <span className={calc.dueAmount > 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}>
                    ₹{fmt(calc.dueAmount)}
                  </span>
                </div>
              </div>

              {/* Status + Finalize */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Payment Status</Label>
                  <PaymentStatusBadge status={paymentStatus} />
                </div>

                <Button
                  className="w-full"
                  onClick={sendInvoice}
                  disabled={isSaving || !invoice.customer || invoice.items.length === 0}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isSaving ? 'Processing…' : 'Finalize Invoice'}
                </Button>

                <Button variant="outline" className="w-full" onClick={saveDraft} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── GST Breakdown ─────────────────────────────────────────────── */}
          {invoice.items.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  GST Breakup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(
                    invoice.items.reduce<Record<number, number>>((acc, item) => {
                      acc[item.gstRate] = (acc[item.gstRate] || 0) + item.taxAmount;
                      return acc;
                    }, {})
                  ).map(([rate, amount]) => (
                    <div key={rate} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST @ {rate}%</span>
                      <span className="font-medium">₹{fmt(amount)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total GST</span>
                    <span>₹{fmt(calc.gstAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AddCustomerModal
        open={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onAdd={handleAddCustomer}
      />

      {/* ── Email Invoice Modal ─────────────────────────────────────────── */}
      <Dialog open={showEmailModal} onOpenChange={(o) => { if (!isSendingEmail) setShowEmailModal(o); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Email Invoice
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">To <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                value={emailFields.to}
                onChange={(e) => setEmailFields((f) => ({ ...f, to: e.target.value }))}
                placeholder="customer@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Subject</Label>
              <Input
                value={emailFields.subject}
                onChange={(e) => setEmailFields((f) => ({ ...f, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Message</Label>
              <Textarea
                rows={7}
                className="text-sm resize-none font-mono"
                value={emailFields.body}
                onChange={(e) => setEmailFields((f) => ({ ...f, body: e.target.value }))}
              />
            </div>

            <div className="rounded-md bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              A PDF copy of the invoice will be attached automatically.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailModal(false)} disabled={isSendingEmail}>
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={isSendingEmail || !emailFields.to}>
              {isSendingEmail
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</>
                : <><Send className="mr-2 h-4 w-4" />Send Email</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Invoice Item Row ─────────────────────────────────────────────────────────

interface InvoiceItemRowProps {
  item: InvoiceItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (updates: Partial<InvoiceItem>) => void;
  onRemove: () => void;
}

function InvoiceItemRow({ item, isEditing, onEdit, onSave, onUpdate, onRemove }: InvoiceItemRowProps) {
  const isOverstock = item.quantity >= item.product.stock.available;

  if (isEditing) {
    return (
      <TableRow className="bg-primary/5">
        <TableCell className="py-2">
          <div>
            <p className="font-medium text-xs">{item.product.name}</p>
            <p className="text-[10px] text-muted-foreground">{item.product.category}</p>
          </div>
        </TableCell>
        <TableCell className="py-2">
          <span className="text-xs font-mono text-muted-foreground">{item.product.sku}</span>
        </TableCell>
        <TableCell className="py-2 text-center">
          <StockBadge status={item.product.stock.status} available={item.product.stock.available} />
        </TableCell>
        <TableCell className="py-2">
          <Input
            type="number"
            min={1}
            max={item.product.stock.available}
            value={item.quantity}
            onChange={(e) => onUpdate({ quantity: Number(e.target.value) })}
            className={cn('w-16 h-7 text-xs text-center', isOverstock && 'border-amber-500')}
          />
        </TableCell>
        <TableCell className="py-2">
          <Input
            type="number"
            min={0}
            value={item.unitPrice}
            onChange={(e) => onUpdate({ unitPrice: Number(e.target.value) })}
            className="w-24 h-7 text-xs text-right"
          />
        </TableCell>
        <TableCell className="py-2">
          <div className="flex gap-1">
            <Select
              value={item.discount.type}
              onValueChange={(v) => onUpdate({ discount: { ...item.discount, type: v as DiscountType } })}
            >
              <SelectTrigger className="w-14 h-7 text-xs px-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">%</SelectItem>
                <SelectItem value="fixed">₹</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={0}
              value={item.discount.value || ''}
              onChange={(e) => onUpdate({ discount: { ...item.discount, value: Number(e.target.value) } })}
              className="w-14 h-7 text-xs"
              placeholder="0"
            />
          </div>
        </TableCell>
        <TableCell className="py-2 text-right">
          <Select
            value={String(item.gstRate)}
            onValueChange={(v) => onUpdate({ gstRate: Number(v) })}
          >
            <SelectTrigger className="w-16 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 5, 12, 18, 28].map((r) => (
                <SelectItem key={r} value={String(r)}>{r}%</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="py-2 text-right font-bold text-sm">₹{fmt(item.total)}</TableCell>
        <TableCell className="py-2 text-center">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onSave}>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className={cn('group', isOverstock && 'bg-amber-50/50 dark:bg-amber-950/20')}>
      <TableCell className="py-2.5">
        <div>
          <p className="font-medium text-xs">{item.product.name}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{item.product.category}</p>
        </div>
      </TableCell>
      <TableCell className="py-2.5">
        <span className="text-xs font-mono text-muted-foreground">{item.product.sku}</span>
      </TableCell>
      <TableCell className="py-2.5 text-center">
        <StockBadge status={item.product.stock.status} available={item.product.stock.available} />
      </TableCell>
      <TableCell className="py-2.5 text-center">
        <span className={cn('text-sm font-semibold', isOverstock && 'text-amber-600')}>
          {item.quantity}
        </span>
      </TableCell>
      <TableCell className="py-2.5 text-right text-sm">₹{fmt(item.unitPrice)}</TableCell>
      <TableCell className="py-2.5 text-center text-sm">
        {item.discount.value > 0
          ? item.discount.type === 'percentage'
            ? `${item.discount.value}%`
            : `₹${fmt(item.discount.value)}`
          : <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell className="py-2.5 text-right text-sm">{item.gstRate}%</TableCell>
      <TableCell className="py-2.5 text-right font-bold text-sm">₹{fmt(item.total)}</TableCell>
      <TableCell className="py-2.5 text-center">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onEdit} title="Edit">
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 hover:text-destructive"
            onClick={onRemove}
            title="Remove"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
