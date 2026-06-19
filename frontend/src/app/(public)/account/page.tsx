'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Package, Heart, MapPin, Settings, ShoppingBag, TrendingUp } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user: currentUser, isLoading } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    wishlistItems: 0,
    savedAddresses: 0,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      router.push('/auth/login?redirect=/account');
      return;
    }
    fetchUserStats();
  }, [currentUser, isLoading, router]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(apiUrl('/user/dashboard'));
      if (response.ok) {
        const data = await response.json();
        setStats(data.data ?? data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  if (isLoading || !currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser.name}!</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                <p className="text-2xl font-bold">{stats.wishlistItems}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saved Addresses</p>
                <p className="text-2xl font-bold">{stats.savedAddresses}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/account/orders">
                <Package className="mr-3 h-4 w-4" />
                View All Orders
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/account/wishlist">
                <Heart className="mr-3 h-4 w-4" />
                My Wishlist
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/account/addresses">
                <MapPin className="mr-3 h-4 w-4" />
                Manage Addresses
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/account/profile">
                <User className="mr-3 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/account/settings">
                <Settings className="mr-3 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Name</span>
              <span className="text-sm">{currentUser.name}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm">{currentUser.email}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Account Type</span>
              <Badge variant="secondary" className="capitalize">
                {currentUser.role}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm">
                {(currentUser as any).createdAt ? new Date((currentUser as any).createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}