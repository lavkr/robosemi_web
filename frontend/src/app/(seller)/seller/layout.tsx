'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  ArrowLeft,
  Store,
  Settings,
  Tag,
  Warehouse,
  Star,
  Truck
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/seller', icon: LayoutDashboard },
  { name: 'Products', href: '/seller/products', icon: Package },
  { name: 'Orders', href: '/seller/orders', icon: ShoppingCart },
  { name: 'Inventory', href: '/seller/inventory', icon: Warehouse },
  { name: 'Reviews', href: '/seller/reviews', icon: Star },
  { name: 'Coupons', href: '/seller/coupons', icon: Tag },
  { name: 'Shipping', href: '/seller/shipping', icon: Truck },
  { name: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/seller/settings', icon: Settings },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/seller');
    } else if ((user.role as string) !== 'seller') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || (user.role as string) !== 'seller') {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">Seller Panel</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.name || 'Seller'}
                    </p>
                  </div>
                </div>

                <Separator className="mb-6" />

                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <Separator className="my-6" />

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Store
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}