'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  user: { name: string };
  total: number;
  status: string;
  createdAt: string;
}

interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export default function SellerDashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
      fetchRecentOrders();
      fetchTopProducts();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(apiUrl('/seller/dashboard'));
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(apiUrl('/seller/orders?limit=5'));
      if (response.ok) {
        const data = await response.json();
        setRecentOrders(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent orders:', error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await fetch(apiUrl('/seller/top-products'));
      if (response.ok) {
        const data = await response.json();
        setTopProducts(data.topProducts || []);
      }
    } catch (error) {
      console.error('Failed to fetch top products:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your seller portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.user.name} • ₹{order.total}</p>
                  </div>
                  <Badge variant="outline">{order.status}</Badge>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.totalSold} sold</p>
                  </div>
                  <Badge>₹{product.revenue.toLocaleString()}</Badge>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}