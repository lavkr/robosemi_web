'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    sellerId: string;
  }>;
  total: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function SellerOrders() {
  const { data: session } = useSession();
  const user = session?.user;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user, filterStatus]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/seller/orders?${params}`);
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

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage your product orders</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.user.name} • {order.user.email}
                  </p>
                </div>
                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                  {order.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Total Amount:</strong> ₹{order.total}
                  </div>
                </div>

                <div>
                  <strong className="text-sm">Items:</strong>
                  <div className="mt-2 space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="text-sm">Shipping Address:</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, 
                    {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {orders.length === 0 ? 'No orders found.' : 'No orders match your search criteria.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}