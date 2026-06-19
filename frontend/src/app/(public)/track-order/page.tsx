'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/orders/track?orderNumber=${orderNumber}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your order number to track your shipment
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={trackOrder} className="space-y-4">
              <div>
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="Enter your order number (e.g., RBS123456)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  'Track Order'
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {order && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order #{order.orderNumber}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.orderStatus)}
                  <Badge className={getStatusColor(order.orderStatus)}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Status Timeline */}
              <div>
                <h3 className="font-medium mb-4">Order Status</h3>
                <div className="space-y-3">
                  {[
                    { status: 'pending', label: 'Order Placed' },
                    { status: 'confirmed', label: 'Order Confirmed' },
                    { status: 'processing', label: 'Processing' },
                    { status: 'shipped', label: 'Shipped' },
                    { status: 'delivered', label: 'Delivered' },
                  ].map((step, index) => {
                    const isCompleted = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
                      .indexOf(order.orderStatus) >= index;
                    const isCurrent = order.orderStatus === step.status;
                    
                    return (
                      <div key={step.status} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`} />
                        <span className={`text-sm ${
                          isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Order Details */}
              <div>
                <h3 className="font-medium mb-4">Order Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Order Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment Status:</span>
                    <Badge variant="outline">
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Amount:</span>
                    <span className="font-medium">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Items */}
              <div>
                <h3 className="font-medium mb-4">Items ({order.items.length})</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <h3 className="font-medium mb-4">Shipping Address</h3>
                <div className="text-sm text-muted-foreground">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}