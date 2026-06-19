'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Loader2, TrendingUp } from 'lucide-react';

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
}

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const response = await fetch(apiUrl('/products?sortBy=rating&sortOrder=desc&limit=20'));
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Best Sellers</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most popular products loved by customers worldwide. 
          These top-rated items are flying off our shelves!
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">No best sellers found</h3>
          <p className="text-muted-foreground">Check back later for our top products</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={product._id} className="relative">
              <ProductCard product={product} />
              {index < 3 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  #{index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}