'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect, Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';

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

function SearchContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    if (searchQuery) {
      searchProducts();
    }
  }, [searchQuery, pagination.page]);

  const searchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/products?${params}`);
      const data = await response.json();
      
      setProducts(data.data || []);
      setPagination(prev => ({ ...prev, ...data.meta }));
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    searchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>
        
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Search'
            )}
          </Button>
        </form>
      </div>

      {searchQuery && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Searching...' : `${pagination.total} results for "${searchQuery}"`}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : products.length === 0 && searchQuery ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try searching with different keywords
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}