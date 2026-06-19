'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';

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
  shipment?: {
    awbCode?: string;
    courierName?: string;
    status: string;
    trackingHistory?: Array<{
      status: string;
      statusDetail: string;
      date: string;
      location?: string;
    }>;
  };
}

export default function TrackOrderByNumberPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.orderNumber) {
      trackOrder(params.orderNumber as string);
    }
  }, [params.orderNumber]);

  const trackOrder = async (orderNumber: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/orders/track?orderNumber=${orderNumber}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.data ?? data.order ?? data);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 mb-4">{error || 'Order not found'}</p>
            <Button onClick={() => router.push('/track-order')}>
              Track Another Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/track-order')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracking
          </Button>
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Status</CardTitle>
              <Badge className={getStatusColor(order.orderStatus)}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Order Timeline</h3>
              <div className="space-y-3">
                {order.shipment?.trackingHistory && order.shipment.trackingHistory.length > 0 ? (
                  // Show Shiprocket tracking history if available
                  order.shipment.trackingHistory.map((track, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{track.status}</div>
                        <div className="text-xs text-muted-foreground">{track.statusDetail}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(track.date).toLocaleString()}
                          {track.location && ` • ${track.location}`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Default timeline if no tracking history
                  [
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
                  })
                )}
              </div>
            </div>

            <Separator />

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
                {order.shipment?.awbCode && (
                  <div className="flex justify-between text-sm">
                    <span>AWB Code:</span>
                    <span className="font-mono">{order.shipment.awbCode}</span>
                  </div>
                )}
                {order.shipment?.courierName && (
                  <div className="flex justify-between text-sm">
                    <span>Courier:</span>
                    <span>{order.shipment.courierName}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

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
      </div>
    </div>
  );
}