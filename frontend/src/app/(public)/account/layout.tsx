'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

const navigation = [
  { name: 'Profile', href: '/account', icon: User },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Settings', href: '/account/settings', icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user: currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      router.push('/auth/login?redirect=/account');
    }
  }, [currentUser, isLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (isLoading || !currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  {currentUser.role !== 'user' && (
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="h-3 w-3" />
                      <span className="text-xs font-medium capitalize">{currentUser.role}</span>
                    </div>
                  )}
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
                
                {(['admin', 'staff'] as string[]).includes(currentUser.role) && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </nav>

              <Separator className="my-6" />

              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}