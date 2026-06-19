'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Settings,
  Zap,
  Radio,
  Move,
  Cpu,
  Wrench,
  LogOut,
  Package,
  Shield,
  Phone,
  Mail,
  X,
  Star,
  TrendingUp,
  MapPin,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import Image from 'next/image';



const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  settings: Settings,
  zap: Zap,
  radio: Radio,
  move: Move,
  cpu: Cpu,
  wrench: Wrench,
};

interface SearchResult {
  _id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  images: string[];
  type: 'product' | 'category' | 'brand';
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { data: session } = useSession();
  const { cart, wishlist, getCartItemsCount } = useCart();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const currentUser = session?.user;
  const cartItemsCount = getCartItemsCount();

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  // Search functionality
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/search?q=${encodeURIComponent(query)}&limit=8`);
      const data = await response.json();
      setSearchResults(data.results || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');

    if (result.type === 'product') {
      router.push(`/products/${result._id}`);
    } else if (result.type === 'category') {
      router.push(`/products?category=${encodeURIComponent(result.name)}`);
    } else if (result.type === 'brand') {
      router.push(`/products?brand=${encodeURIComponent(result.name)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Top Bar - Desktop Only */}
      <div className="hidden lg:block bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:+919102072525" className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
                <Phone className="h-3 w-3" />
                <span>+91 92880 72525</span>
              </a>
              <a href="mailto:reach@robosemi.in" className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
                <Mail className="h-3 w-3" />
                <span>reach@robosemi.in</span>
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/track-order" className="hover:text-blue-200 transition-colors">Track Order</Link>
              <Link href="/help" className="hover:text-blue-200 transition-colors">Help</Link>
              <Link href="/seller-register" className="hover:text-blue-200 transition-colors">Become a Seller</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Main Header */}
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src={'/logo.png'}
                height={190}
                width={160}
                alt='RoboSemi'
                className="h-14 w-auto"
              />
            </Link>

            {/* Categories - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors">
                All Products</Link>
              <Link href="/deals" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors">
                Deals
              </Link>
              <Link href="/new-arrivals" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors">
                New Arrivals
              </Link>
              <Link href="/projects" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors">
                Projects
              </Link>
              <Link href="/training" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors">
                Training
              </Link>
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="flex">
                  <Input
                    placeholder="Search for products, brands and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                    className="flex-1 h-10 pl-4 pr-12 border-2 border-blue-500 focus:border-blue-600 rounded-l-sm focus:ring-0"
                  />
                  <Button
                    type="submit"
                    className="h-10 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-r-sm rounded-l-none border-2 border-blue-500"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {isSearching && (
                  <Loader2 className="absolute right-16 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 animate-spin" />
                )}

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={`${result.type}-${result._id}-${index}`}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      >
                        {result.type === 'product' && result.images?.[0] && (
                          <Image
                            src={result.images[0]}
                            alt={result.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        )}
                        {result.type === 'category' && (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        {result.type === 'brand' && (
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Star className="h-5 w-5 text-purple-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{result.name}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {result.type === 'product' && `${result.category} • ${result.brand}`}
                            {result.type === 'category' && 'Category'}
                            {result.type === 'brand' && 'Brand'}
                          </div>
                        </div>
                        {result.type === 'product' && result.price && (
                          <div className="text-sm font-medium text-blue-600">
                            ₹{result.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                    {searchQuery.trim() && (
                      <div className="p-3 border-t bg-gray-50">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </form>

            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100 p-2"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Wishlist */}
              <Link href="/wishlist" className="hidden sm:flex relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.image || ''} alt={currentUser.name || ''} />
                        <AvatarFallback className="text-sm bg-blue-100 text-blue-600">{currentUser.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium">{currentUser.name}</div>
                        <div className="text-xs text-gray-500">My Account</div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="sm:hidden">
                      <Link href="/wishlist" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    {currentUser.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-sm font-medium">
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className="lg:hidden border-t bg-white p-4" ref={mobileSearchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex">
              <Input
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                className="flex-1 h-10 pl-4 pr-4 border-2 border-blue-500 focus:border-blue-600 rounded-l-sm focus:ring-0"
                autoFocus
              />
              <Button
                type="submit"
                className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-r-sm rounded-l-none border-2 border-blue-500"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {isSearching && (
              <Loader2 className="absolute right-16 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 animate-spin" />
            )}
          </form>

          {/* Mobile Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={`mobile-${result.type}-${result._id}-${index}`}
                  onClick={() => handleResultClick(result)}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  {result.type === 'product' && result.images?.[0] && (
                    <Image
                      src={result.images[0]}
                      alt={result.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                  )}
                  {result.type === 'category' && (
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  {result.type === 'brand' && (
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Star className="h-5 w-5 text-purple-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {result.type === 'product' && `${result.category} • ${result.brand}`}
                      {result.type === 'category' && 'Category'}
                      {result.type === 'brand' && 'Brand'}
                    </div>
                  </div>
                  {result.type === 'product' && result.price && (
                    <div className="text-sm font-medium text-blue-600">
                      ₹{result.price.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
              {searchQuery.trim() && (
                <div className="p-3 border-t bg-gray-50">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 py-4">
            {/* Mobile Navigation */}
            <div className="space-y-1">
              <Link
                href="/products"
                className="flex items-center gap-3 py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Package className="h-5 w-5 text-gray-600" />
                <span>All Products</span>
              </Link>
              <Link
                href="/deals"
                className="flex items-center gap-3 py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TrendingUp className="h-5 w-5 text-gray-600" />
                <span>Deals & Offers</span>
              </Link>
              <Link
                href="/new-arrivals"
                className="flex items-center gap-3 py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star className="h-5 w-5 text-gray-600" />
                <span>New Arrivals</span>
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-3 py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Wrench className="h-5 w-5 text-gray-600" />
                <span>Projects</span>
              </Link>

              <Link
                href="/training"
                className="flex items-center gap-3 py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Wrench className="h-5 w-5 text-gray-600" />
                <span>Training</span>
              </Link>


              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Mobile-only links */}
              <div className="space-y-1">
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors sm:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link
                  href="/track-order"
                  className="flex items-center gap-3 py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span>Track Order</span>
                </Link>
                <Link
                  href="/help"
                  className="flex items-center gap-3 py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Phone className="h-5 w-5 text-gray-600" />
                  <span>Help & Support</span>
                </Link>
              </div>
            </div>

            {/* Mobile Auth */}
            {!currentUser && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex flex-col space-y-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                    <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}