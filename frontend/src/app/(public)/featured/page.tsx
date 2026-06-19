'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Award, Zap, TrendingUp, Crown, Sparkles, Loader2 } from 'lucide-react';
import { fetchFeaturedProducts } from '@/api/products.api';

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
  featuredReason?: string;
}

const highlights = [
  {
    icon: Crown,
    title: 'Editor\'s Choice',
    description: 'Handpicked by our technical experts',
    count: 12
  },
  {
    icon: Star,
    title: 'Customer Favorites',
    description: 'Highest rated by our community',
    count: 8
  },
  {
    icon: Award,
    title: 'Innovation Awards',
    description: 'Recognized for breakthrough technology',
    count: 5
  },
  {
    icon: Sparkles,
    title: 'Best Value',
    description: 'Exceptional quality at great prices',
    count: 15
  }
];

export default function FeaturedPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Featured', icon: Crown },
    { id: 'controllers', name: 'Controllers', icon: Zap },
    { id: 'sensors', name: 'Sensors', icon: Star },
    { id: 'electronics', name: 'Electronics', icon: TrendingUp },
    { id: 'actuators', name: 'Actuators', icon: Award },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchFeaturedProducts();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch featured products');
        }
        
        const products = result.data?.products || [];
        const enhancedProducts = products.map((product: Product) => ({
          ...product,
          inStock: product.stock > 0,
          featuredReason: ['Editor\'s Choice', 'Customer Favorite', 'Innovation Award', 'Best Value'][Math.floor(Math.random() * 4)]
        }));
        
        setFeaturedProducts(enhancedProducts);
        
        // Generate dynamic categories
        const uniqueCategories = Array.from(new Set(enhancedProducts.map((p: Product) => p.category))) as string[];
        const dynamicCategories = [
          { id: 'all', name: 'All Featured', icon: Crown },
          ...uniqueCategories.map((cat: string) => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            icon: Star
          }))
        ];
        setCategories(dynamicCategories);
        
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? featuredProducts 
    : featuredProducts.filter(product => product.category.toLowerCase() === activeCategory);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Loading featured products...</p>
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
        <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200 px-4 py-2">
          Featured Products
        </Badge>
        <h1 className="heading-xl text-balance">
          <span className="text-gradient">Premium Selection</span> of Excellence
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Discover our carefully curated collection of exceptional products, featuring 
          editor's picks, customer favorites, and award-winning innovations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;
          return (
            <Card key={index} className="card-hover text-center fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="font-semibold">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
                <Badge variant="outline">{highlight.count} Products</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <p className="text-muted-foreground">
                  {filteredProducts.length} featured products
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product._id} className="relative fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                      ⭐ Featured
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="text-xs">
                      {product.featuredReason}
                    </Badge>
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No featured products found</h3>
                <p className="text-muted-foreground">
                  No featured products available in this category.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mt-16 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-8 text-center space-y-6">
          <Crown className="h-12 w-12 text-orange-600 mx-auto" />
          <h3 className="text-2xl font-bold">What Makes a Product Featured?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Exceptional Quality
              </h4>
              <p className="text-sm text-muted-foreground">
                Products that exceed industry standards and customer expectations
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                Innovation Excellence
              </h4>
              <p className="text-sm text-muted-foreground">
                Cutting-edge technology and breakthrough features
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Proven Performance
              </h4>
              <p className="text-sm text-muted-foreground">
                Consistently high ratings and positive customer feedback
              </p>
            </div>
          </div>
          <Button size="lg" className="btn-gradient">
            Explore All Featured Products
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}