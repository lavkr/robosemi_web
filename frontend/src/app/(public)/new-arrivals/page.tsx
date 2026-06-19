'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  createdAt: string;
}

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await fetch(apiUrl('/products/new-arrivals?limit=20'));
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const isNewProduct = (createdAt: string) => {
    const productDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return productDate > thirtyDaysAgo;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">New Arrivals</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Be the first to explore our latest products! Fresh innovations and cutting-edge technology 
          just arrived in our store.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">No new arrivals found</h3>
          <p className="text-muted-foreground">Check back soon for new products</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard product={product} />
              {isNewProduct(product.createdAt) && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-green-400 to-blue-500 text-white">
                  NEW
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}