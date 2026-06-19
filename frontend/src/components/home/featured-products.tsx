'use client';

import { apiUrl } from '@/utils/api-url';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/product-card';
import { ArrowRight, TrendingUp, Star, Zap } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  discount?: number;
  inStock: boolean;
}


export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(apiUrl('/products?featured=true&limit=8'));
      if (response.ok) {
        const data = await response.json();
        setFeaturedProducts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-responsive text-center py-20">
          <div className="glass-card p-12 max-w-md mx-auto">
            <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-responsive">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-16 lg:mb-20">
          <div className="space-y-6 flex-1">
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-8 py-3 rounded-full font-semibold text-sm lg:text-base">
              Featured Collection
            </Badge>
            <h2 className="heading-lg text-balance">
              Premium <span className="text-gradient-premium">Components</span> for Your Projects
            </h2>
           
          </div>
          
          <Button size="lg" asChild className="hidden lg:flex btn-gradient-premium rounded-2xl px-8 py-4">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

     
        {/* Enhanced Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {featuredProducts.map((product, index) => (
            <div key={product._id} className="fade-in-up hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-12 lg:hidden">
          <Button size="lg" asChild className="btn-gradient-premium rounded-2xl px-8 py-4">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}