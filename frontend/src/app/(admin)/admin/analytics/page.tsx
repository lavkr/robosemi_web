'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Eye,
  Search,
  Download
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [loading, setLoading] = useState(false);
  type ConversionFunnel = {
    page_views: number;
    product_views: number;
    add_to_cart: number;
    purchases: number;
  };

  const [analyticsData, setAnalyticsData] = useState<{
    pageViews: any[];
    topProducts: any[];
    conversionFunnel: ConversionFunnel;
    searchAnalytics: any[];
  }>({
    pageViews: [],
    topProducts: [],
    conversionFunnel: {
      page_views: 0,
      product_views: 0,
      add_to_cart: 0,
      purchases: 0,
    },
    searchAnalytics: []
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch different analytics data
      const [pageViews, topProducts, conversionFunnel, searchAnalytics] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/analytics?type=page_views&startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/analytics?type=top_products&startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/analytics?type=conversion_funnel&startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/analytics?type=search_analytics&startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`).then(r => r.json())
      ]);

      setAnalyticsData({
        pageViews,
        topProducts,
        conversionFunnel,
        searchAnalytics
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const stats = [
    {
      title: 'Total Page Views',
      value: analyticsData.pageViews.reduce((sum: number, item: any) => sum + item.views, 0).toLocaleString(),
      change: '+12.5%',
      icon: Eye,
      color: 'text-blue-600',
    },
    {
      title: 'Unique Visitors',
      value: analyticsData.pageViews.reduce((sum: number, item: any) => sum + item.uniqueUsers, 0).toLocaleString(),
      change: '+8.2%',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.5%',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Total Searches',
      value: analyticsData.searchAnalytics.reduce((sum: number, item: any) => sum + item.count, 0).toLocaleString(),
      change: '+15.3%',
      icon: Search,
      color: 'text-orange-600',
    },
  ];

  const conversionData = [
    { name: 'Page Views', value: analyticsData.conversionFunnel.page_views || 0 },
    { name: 'Product Views', value: analyticsData.conversionFunnel.product_views || 0 },
    { name: 'Add to Cart', value: analyticsData.conversionFunnel.add_to_cart || 0 },
    { name: 'Purchases', value: analyticsData.conversionFunnel.purchases || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your website performance and user behavior
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">
                      {stat.change} from last period
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.pageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="uniqueUsers" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Viewed Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.slice(0, 5).map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.uniqueUsers} unique viewers
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.views}</p>
                    <p className="text-sm text-muted-foreground">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Top Search Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.searchAnalytics.slice(0, 5).map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">"{item.query}"</p>
                    <p className="text-sm text-muted-foreground">
                      {item.uniqueUsers} unique searches
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.count}</p>
                    <p className="text-sm text-muted-foreground">searches</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Direct', value: 45 },
                    { name: 'Search', value: 30 },
                    { name: 'Social', value: 15 },
                    { name: 'Referral', value: 10 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Direct Traffic</span>
                </div>
                <span className="font-semibold">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Search Engines</span>
                </div>
                <span className="font-semibold">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Social Media</span>
                </div>
                <span className="font-semibold">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Referrals</span>
                </div>
                <span className="font-semibold">10%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}