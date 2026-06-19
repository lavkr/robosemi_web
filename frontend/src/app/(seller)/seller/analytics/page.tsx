'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface AnalyticsData {
  monthlyRevenue: Array<{
    _id: { year: number; month: number };
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  orderStats: Array<{
    _id: string;
    count: number;
  }>;
}

export default function SellerAnalytics() {
  const { data: session } = useSession();
  const user = session?.user;
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(apiUrl('/seller/analytics'));
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const totalRevenue = analytics?.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const totalOrders = analytics?.orderStats.reduce((sum, item) => sum + item.count, 0) || 0;

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
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your sales performance and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.topProducts.reduce((sum, product) => sum + product.totalSold, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total units</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.monthlyRevenue.map((item) => (
                <div key={`${item._id.year}-${item._id.month}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{getMonthName(item._id.month)} {item._id.year}</p>
                    <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                  </div>
                  <Badge>₹{item.revenue.toLocaleString()}</Badge>
                </div>
              ))}
              {!analytics?.monthlyRevenue.length && (
                <p className="text-sm text-muted-foreground">No revenue data available</p>
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
              {analytics?.topProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.totalSold} units sold</p>
                  </div>
                  <Badge>₹{product.revenue.toLocaleString()}</Badge>
                </div>
              ))}
              {!analytics?.topProducts.length && (
                <p className="text-sm text-muted-foreground">No product data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics?.orderStats.map((stat) => (
              <div key={stat._id} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stat.count}</div>
                <p className="text-sm text-muted-foreground capitalize">{stat._id}</p>
              </div>
            ))}
            {!analytics?.orderStats.length && (
              <p className="text-sm text-muted-foreground col-span-full text-center">No order data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}