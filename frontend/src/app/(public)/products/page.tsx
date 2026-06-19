'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect, useCallback, Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, Filter, X, Search, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
}

interface FilterData {
  brands: string[];
  categories: string[];
  subcategories: string[];
  tags: string[];
  priceRange: { minPrice: number; maxPrice: number };
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState<FilterData>({
    brands: [],
    categories: [],
    subcategories: [],
    tags: [],
    priceRange: { minPrice: 0, maxPrice: 10000 }
  });
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    subcategory: 'all',
    brand: 'all',
    tags: [] as string[],
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    inStock: false,
    featured: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.category && filters.category !== 'all' && { category: filters.category }),
        ...(filters.subcategory && filters.subcategory !== 'all' && { subcategory: filters.subcategory }),
        ...(filters.brand && filters.brand !== 'all' && { brand: filters.brand }),
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.featured && { featured: 'true' }),
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/products?${params}`);
      const data = await response.json();
      
      let filteredProducts = data.data || [];
      
      // Client-side filtering for complex filters
      if (filters.tags.length > 0) {
        filteredProducts = filteredProducts.filter((product: Product) =>
          filters.tags.some(tag => product.tags?.includes(tag))
        );
      }
      
      if (filters.minRating > 0) {
        filteredProducts = filteredProducts.filter((product: Product) =>
          product.rating >= filters.minRating
        );
      }
      
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter((product: Product) => product.inStock);
      }
      
      setProducts(filteredProducts);
      setPagination(prev => ({ ...prev, ...data.meta }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.category, filters.subcategory, filters.brand, filters.minPrice, filters.maxPrice, filters.sortBy, filters.sortOrder, filters.featured, filters.tags, filters.minRating, filters.inStock]);

  const fetchFilterData = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/products/filters'));
      const json = await response.json();
      const f = json.data ?? {};
      setFilterData({
        brands: f.brands || [],
        categories: f.categories || [],
        subcategories: f.subcategories || [],
        tags: f.tags || [],
        priceRange: {
          minPrice: f.priceRange?.min ?? f.priceRange?.minPrice ?? 0,
          maxPrice: f.priceRange?.max ?? f.priceRange?.maxPrice ?? 10000,
        },
      });
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  }, []);

  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  useEffect(() => {
    if (filterData.priceRange.maxPrice > 0 && filters.maxPrice === 10000) {
      setFilters(prev => ({
        ...prev,
        maxPrice: filterData.priceRange.maxPrice
      }));
    }
  }, [filterData.priceRange.maxPrice, filters.maxPrice]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      subcategory: 'all',
      brand: 'all',
      tags: [],
      minPrice: filterData.priceRange.minPrice,
      maxPrice: filterData.priceRange.maxPrice,
      minRating: 0,
      inStock: false,
      featured: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.subcategory && filters.subcategory !== 'all') count++;
    if (filters.brand && filters.brand !== 'all') count++;
    if (filters.tags.length > 0) count++;
    if (filters.minRating > 0) count++;
    if (filters.inStock) count++;
    if (filters.featured) count++;
    if (filters.minPrice > filterData.priceRange.minPrice || filters.maxPrice < filterData.priceRange.maxPrice) count++;
    return count;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">All Products</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
              <p className="text-gray-600 mt-1">
                {pagination.total} products found
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <Button variant="outline" className="lg:hidden" onClick={() => {/* Toggle mobile filters */}}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
              
              {/* Sort Dropdown - Mobile */}
              <div className="lg:hidden">
                <Select 
                  value={`${filters.sortBy}-${filters.sortOrder}`} 
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Highest Rated</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="reviewCount-desc">Most Reviewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm border sticky top-4">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-6">
              {/* Search */}
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {filterData.categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory */}
              {/* {filters.category && filters.category !== 'all' && (
                <div>
                  <Label>Subcategory</Label>
                  <Select value={filters.subcategory} onValueChange={(value) => handleFilterChange('subcategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subcategories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {filterData.subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )} */}

              {/* Brand */}
              <div>
                <Label>Brand</Label>
                <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {filterData.brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <Label>Price Range</Label>
                <div className="px-2 py-4">
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={([min, max]) => {
                      handleFilterChange('minPrice', min);
                      handleFilterChange('maxPrice', max);
                    }}
                    min={filterData.priceRange.minPrice}
                    max={filterData.priceRange.maxPrice}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹{filters.minPrice}</span>
                    <span>₹{filters.maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <Label>Minimum Rating</Label>
                <Select value={filters.minRating.toString()} onValueChange={(value) => handleFilterChange('minRating', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="1">1+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Filters */}
              <div>
                <Label>Quick Filters</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                    />
                    <Label htmlFor="inStock" className="text-sm font-normal">
                      In Stock Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={filters.featured}
                      onCheckedChange={(checked) => handleFilterChange('featured', checked)}
                    />
                    <Label htmlFor="featured" className="text-sm font-normal">
                      Featured Products
                    </Label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {filterData.tags.length > 0 && (
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filterData.tags.slice(0, 10).map((tag) => (
                      <Badge
                        key={tag}
                        variant={filters.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort */}
              <div>
                <Label>Sort By</Label>
                <Select 
                  value={`${filters.sortBy}-${filters.sortOrder}`} 
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Highest Rated</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="reviewCount-desc">Most Reviewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-4">
            {/* Sort Bar - Desktop */}
            <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select 
                  value={`${filters.sortBy}-${filters.sortOrder}`} 
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Customer Rating</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="reviewCount-desc">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {products.length} of {pagination.total} products
              </div>
            </div>
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900">No products found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.pages}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
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
                              size="sm"
                              onClick={() => setPagination(prev => ({ ...prev, page }))}
                            >
                              {page}
                            </Button>
                          );
                        })}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pagination.page === pagination.pages}
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}