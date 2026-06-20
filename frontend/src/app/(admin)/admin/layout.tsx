'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Home,
  Tag,
  Folder,
  Mail,
  FileText,
  BookOpen,
  GraduationCap,
  Truck,
  Store,
  MessageSquare,
  LogOut,
  Image,
  Receipt
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === 'loading') return;
    if (!user) {
      router.push('/auth/login?redirect=/admin');
    } else if (!['admin', 'staff'].includes(user.role as string)) {
      router.push('/');
    }
  }, [user, status, router]);

  if (status === 'loading' || !user || !['admin', 'staff'].includes(user.role as string)) {
    return null;
  }
  return (
    <div className="min-h-screen bg-muted/10">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-background border-r">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-bold text-lg">RoboSemi Admin</span>
            </Link>
            <div className="flex items-center gap-3 mb-8">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </p>
            </div>
            
            <nav className="space-y-2">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin">
                  <LayoutDashboard className="mr-3 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/products">
                  <Package className="mr-3 h-4 w-4" />
                  Products
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/categories">
                  <Folder className="mr-3 h-4 w-4" />
                  Categories
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/slides">
                  <Image className="mr-3 h-4 w-4" />
                  Hero Slides
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/orders">
                  <ShoppingCart className="mr-3 h-4 w-4" />
                  Orders
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/billing">
                  <Receipt className="mr-3 h-4 w-4" />
                  Billing
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/users">
                  <Users className="mr-3 h-4 w-4" />
                  Users
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/sellers">
                  <Store className="mr-3 h-4 w-4" />
                  Sellers
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/coupons">
                  <Tag className="mr-3 h-4 w-4" />
                  Coupons
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/analytics">
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Analytics
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/leads">
                  <MessageSquare className="mr-3 h-4 w-4" />
                  Leads
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/newsletter">
                  <Mail className="mr-3 h-4 w-4" />
                  Newsletter
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/blog">
                  <FileText className="mr-3 h-4 w-4" />
                  Blog
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/projects">
                  <BookOpen className="mr-3 h-4 w-4" />
                  Projects
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/trainings">
                  <GraduationCap className="mr-3 h-4 w-4" />
                  Trainings
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/shipping">
                  <Truck className="mr-3 h-4 w-4" />
                  Shipping
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/settings">
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              
              <Separator className="my-4" />
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/">
                  <Home className="mr-3 h-4 w-4" />
                  Back to Store
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}