'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  minStock: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  specifications: Record<string, any>;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default async function ViewProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <ViewProductContent productId={id} />;
}

function ViewProductContent({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/products/${productId}`);
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
      } else {
        toast.error('Failed to fetch product');
        router.push('/admin/products');
      }
    } catch (error) {
      toast.error('Failed to fetch product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const finalPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">Product Details</p>
          </div>
        </div>
        
        <Button asChild>
          <Link href={`/admin/products/${product._id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{product.description}</p>
            </CardContent>
          </Card>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Product Details Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">SKU</span>
                <p className="font-medium">{product.sku}</p>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Category</span>
                <p className="font-medium">{product.category}</p>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Brand</span>
                <p className="font-medium">{product.brand}</p>
              </div>
              
              <Separator />
              
              <div>
                <span className="text-sm text-muted-foreground">Price</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">₹{finalPrice.toLocaleString()}</span>
                  {product.discount && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <Badge variant="destructive">{product.discount}% OFF</Badge>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Stock</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{product.stock} units</span>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                {product.stock <= product.minStock && product.stock > 0 && (
                  <p className="text-sm text-orange-600 mt-1">Low stock warning</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{product.rating.toFixed(1)}/5</span>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Active</span>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Featured</span>
                <Badge variant={product.isFeatured ? "default" : "secondary"}>
                  {product.isFeatured ? 'Featured' : 'Not Featured'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {(product.weight || product.dimensions) && (
            <Card>
              <CardHeader>
                <CardTitle>Physical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.weight && (
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span>{product.weight}g</span>
                  </div>
                )}
                
                {product.dimensions && (
                  <>
                    {product.dimensions.length && (
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span>{product.dimensions.length}mm</span>
                      </div>
                    )}
                    {product.dimensions.width && (
                      <div className="flex justify-between">
                        <span>Width:</span>
                        <span>{product.dimensions.width}mm</span>
                      </div>
                    )}
                    {product.dimensions.height && (
                      <div className="flex justify-between">
                        <span>Height:</span>
                        <span>{product.dimensions.height}mm</span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {product.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p>{new Date(product.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <p>{new Date(product.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}