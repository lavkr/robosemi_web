'use client';

import { apiUrl } from '@/utils/api-url';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  Calendar, 
  IndianRupee, 
  MapPin,
  Phone,
  Mail,
  X,
  RotateCcw,
  Download,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CANCELLATION_REASONS, RETURN_REASONS } from '@/utils/invoice-generator';

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  cancellation?: {
    reason: string;
    description?: string;
    requestedAt: string;
    processedAt?: string;
    refundAmount?: number;
  };
  return?: {
    reason: string;
    description?: string;
    requestedAt: string;
    processedAt?: string;
    refundAmount?: number;
    returnStatus: string;
  };
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDescription, setCancelDescription] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id as string);
    }
  }, [params.id]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.data ?? data);
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
      router.push('/account/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canCancel = order && ['pending', 'confirmed'].includes(order.orderStatus);
  const canReturn = order && order.orderStatus === 'delivered' && !order.return;
  const canDownloadInvoice = order && ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.orderStatus);

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error('Please select a cancellation reason');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/orders/${order?._id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason, description: cancelDescription })
      });

      if (response.ok) {
        toast.success('Order cancelled successfully');
        fetchOrderDetails(order?._id!);
        setCancelReason('');
        setCancelDescription('');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnOrder = async () => {
    if (!returnReason) {
      toast.error('Please select a return reason');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/orders/${order?._id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: returnReason, description: returnDescription })
      });

      if (response.ok) {
        toast.success('Return request submitted successfully');
        fetchOrderDetails(order?._id!);
        setReturnReason('');
        setReturnDescription('');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit return request');
      }
    } catch (error) {
      toast.error('Failed to submit return request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    window.open(`/api/orders/${order?._id}/invoice`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Order not found</h3>
        <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/account/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/account/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-all">Order #{order.orderNumber}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="font-medium text-sm sm:text-base">₹{item.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Cancellation Details */}
          {order.cancellation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Order Cancelled
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Reason:</span>
                  <span className="ml-2 capitalize">{order.cancellation.reason.replace('_', ' ')}</span>
                </div>
                {order.cancellation.description && (
                  <div>
                    <span className="font-medium">Details:</span>
                    <p className="text-sm text-muted-foreground mt-1">{order.cancellation.description}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Cancelled on:</span>
                  <span className="ml-2">{new Date(order.cancellation.requestedAt).toLocaleDateString()}</span>
                </div>
                {order.cancellation.refundAmount && (
                  <div>
                    <span className="font-medium">Refund Amount:</span>
                    <span className="ml-2">₹{order.cancellation.refundAmount.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Return Details */}
          {order.return && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <RotateCcw className="h-5 w-5" />
                  Return Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge className="ml-2" variant={order.return.returnStatus === 'completed' ? 'default' : 'secondary'}>
                    {order.return.returnStatus}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Reason:</span>
                  <span className="ml-2 capitalize">{order.return.reason.replace('_', ' ')}</span>
                </div>
                {order.return.description && (
                  <div>
                    <span className="font-medium">Details:</span>
                    <p className="text-sm text-muted-foreground mt-1">{order.return.description}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Requested on:</span>
                  <span className="ml-2">{new Date(order.return.requestedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm sm:text-base">Order Status</span>
                <Badge className={getStatusColor(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm sm:text-base">Payment Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm sm:text-base">Payment Method</span>
                <span className="capitalize text-sm sm:text-base">{order.paymentMethod}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-sm sm:text-base">Tracking Number</span>
                  <span className="font-mono text-xs sm:text-sm break-all">{order.trackingNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 text-sm sm:text-base">
                  <span>Discount</span>
                  <span>-₹{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base">
                <span>Shipping</span>
                <span>₹{order.shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Tax</span>
                <span>₹{order.tax.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base sm:text-lg">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canDownloadInvoice && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDownloadInvoice}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              )}
              
              {canCancel && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Reason for cancellation *</Label>
                        <Select value={cancelReason} onValueChange={setCancelReason}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {CANCELLATION_REASONS.map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Additional details (optional)</Label>
                        <Textarea 
                          value={cancelDescription}
                          onChange={(e) => setCancelDescription(e.target.value)}
                          placeholder="Provide additional details..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleCancelOrder}
                          disabled={actionLoading || !cancelReason}
                          className="flex-1"
                        >
                          {actionLoading ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              
              {canReturn && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Return Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Return Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Reason for return *</Label>
                        <Select value={returnReason} onValueChange={setReturnReason}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {RETURN_REASONS.map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Additional details (optional)</Label>
                        <Textarea 
                          value={returnDescription}
                          onChange={(e) => setReturnDescription(e.target.value)}
                          placeholder="Describe the issue in detail..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleReturnOrder}
                          disabled={actionLoading || !returnReason}
                          className="flex-1"
                        >
                          {actionLoading ? 'Submitting...' : 'Submit Return Request'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          {order.trackingNumber && (
            <Card>
              <CardContent className="pt-6">
                <Button 
                  className="w-full"
                  onClick={() => window.location.href = `/track-order?tracking=${order.trackingNumber}`}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}