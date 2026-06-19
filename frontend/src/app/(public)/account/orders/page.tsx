'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Package, Eye, Truck } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/account/orders');
      return;
    }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(apiUrl('/orders'));
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
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
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">
            When you place your first order, it will appear here.
          </p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-muted-foreground">
                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Total: ₹{order.total.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/account/orders/${order._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                      {order.orderStatus === 'shipped' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/track-order?order=${order.orderNumber}`}>
                            <Truck className="mr-2 h-4 w-4" />
                            Track Order
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}