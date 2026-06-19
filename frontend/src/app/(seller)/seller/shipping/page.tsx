'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Truck, Package } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Order {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string; phone?: string };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  trackingNumber?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export default function SellerShipping() {
  const { data: session } = useSession();
  const user = session?.user;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/seller/shipping?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(apiUrl('/seller/shipping'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          orderId: selectedOrder._id,
          status: newStatus,
          trackingNumber: trackingNumber || undefined
        })
      });

      if (response.ok) {
        await fetchOrders();
        setIsDialogOpen(false);
        setSelectedOrder(null);
        setTrackingNumber('');
        setNewStatus('');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const statusColors = {
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shipping & Fulfillment</h1>
        <p className="text-muted-foreground">Manage order shipping and tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'confirmed').length}
                </div>
                <p className="text-sm text-muted-foreground">Ready to Ship</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'shipped').length}
                </div>
                <p className="text-sm text-muted-foreground">In Transit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.user.name} • {order.user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setTrackingNumber(order.trackingNumber || '');
                      setNewStatus(order.status);
                      setIsDialogOpen(true);
                    }}
                  >
                    Update
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Items:</strong>
                  <ul className="mt-1">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Shipping Address:</strong>
                  <p className="mt-1">
                    {order.shippingAddress.street}, {order.shippingAddress.city},
                    {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <strong>Tracking Number:</strong> {order.trackingNumber}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No orders ready for shipping.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <Label>Order: {selectedOrder.orderNumber}</Label>
                <p className="text-sm text-muted-foreground">
                  Customer: {selectedOrder.user.name}
                </p>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tracking">Tracking Number (Optional)</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>
              <Button onClick={handleUpdateOrder} className="w-full">
                Update Order
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}