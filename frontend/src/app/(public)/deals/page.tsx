'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, Tag, TrendingDown, Clock, Loader2 } from 'lucide-react';
import { fetchDealsProducts } from '@/api/products.api';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  discount?: number;
  stock: number;
  inStock: boolean;
}

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('discount');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchDealsProducts();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch deals');
        }
        
        const dealsProducts = result.data?.products || [];
        const enhancedProducts = dealsProducts.map((p: Product) => ({ 
          ...p, 
          inStock: p.stock > 0 
        }));
        
        setProducts(enhancedProducts);
        
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      case 'price-low':
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      case 'price-high':
        const priceA2 = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB2 = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceB2 - priceA2;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Loading deals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 mb-12">
          <Badge className="bg-red-100 text-red-800 border-red-200 px-4 py-2">
            Error
          </Badge>
          <h1 className="heading-xl text-balance">
            Something went wrong
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-red-100 text-red-800 border-red-200 px-4 py-2">
          Special Deals
        </Badge>
        <h1 className="text-4xl font-bold">
          Amazing <span className="text-gradient">Deals & Discounts</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Save big on premium electronics and automation components with our exclusive deals and limited-time offers.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Percent, title: 'Up to 50% Off', desc: 'Selected items', color: 'text-red-600' },
          { icon: Tag, title: 'Flash Sales', desc: 'Limited time offers', color: 'text-orange-600' },
          { icon: TrendingDown, title: 'Price Drops', desc: 'Recently reduced', color: 'text-green-600' },
          { icon: Clock, title: 'Daily Deals', desc: 'New deals every day', color: 'text-blue-600' }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="text-center p-6 card-hover fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-0 space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-full">
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">All Deals</h2>
          <p className="text-muted-foreground">
            {sortedProducts.length} products on sale • Sorted by {
              sortBy === 'discount' ? 'Highest Discount' : 
              sortBy === 'price-low' ? 'Price: Low to High' : 
              sortBy === 'price-high' ? 'Price: High to Low' : 
              'Rating'
            }
          </p>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="discount">Highest Discount</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {sortedProducts.map((product, index) => (
          <div key={product._id} className="relative fade-in-up" style={{ animationDelay: `${(index % 12) * 0.1}s` }}>
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-red-500 text-white font-semibold">
                -{product.discount}% OFF
              </Badge>
            </div>
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="outline" className="text-xs bg-white/90">
                Save ₹{Math.round((product.price * (product.discount || 0)) / 100)}
              </Badge>
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No deals available</h3>
          <p className="text-muted-foreground mb-4">
            Check back later for new deals and discounts.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Deals
          </Button>
        </div>
      )}

      <Card className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-red-200">
        <CardContent className="p-8 text-center space-y-6">
          <Percent className="h-12 w-12 text-red-600 mx-auto" />
          <h3 className="text-2xl font-bold">Why Choose Our Deals?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-red-500" />
                Genuine Discounts
              </h4>
              <p className="text-sm text-muted-foreground">
                Real savings on authentic products, not inflated prices
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                Limited Time
              </h4>
              <p className="text-sm text-muted-foreground">
                Exclusive offers available for a limited period only
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-500" />
                Best Prices
              </h4>
              <p className="text-sm text-muted-foreground">
                Guaranteed lowest prices on quality electronics
              </p>
            </div>
          </div>
          <Button size="lg" className="btn-gradient">
            Shop All Deals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}