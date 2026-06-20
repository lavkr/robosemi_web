'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus, Share2, Loader2, User, MessageSquare, ThumbsUp, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { RecentlyViewedSection } from '@/components/product/recently-viewed';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  specifications: Record<string, any>;
  tags: string[];
}

interface Review {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  helpful: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { user, isAuthenticated, session } = useAuth();
  const { addProduct } = useRecentlyViewed();

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        const p = data.data ?? data;
        setProduct(p);
        addProduct({
          _id: p._id,
          name: p.name,
          price: p.price,
          discount: p.discount,
          images: p.images,
          rating: p.rating,
          reviewCount: p.reviewCount,
          category: p.category,
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkPurchaseStatus = useCallback(async () => {
    if (!user?.email) return;

    setCheckingPurchase(true);
    try {
      const token = (session as any)?.accessToken;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/orders/check-purchase?productId=${params.id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
      const data = await response.json();
      setCanReview(data.data?.hasPurchased ?? false);
    } catch (error) {
      console.error('Error checking purchase status:', error);
    } finally {
      setCheckingPurchase(false);
    }
  }, [user?.email, params.id, session]);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
      fetchReviews(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      checkPurchaseStatus();
    }
  }, [isAuthenticated, user, checkPurchaseStatus]);

  const handleHelpful = async (reviewId: string) => {
    if (!user?.email) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      const token = (session as any)?.accessToken;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/products/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, helpful: data.helpful }
            : review
        ));
        toast.success('Thank you for your feedback!');
      } else {
        toast.error(data.error || 'Failed to update helpful count');
      }
    } catch (error) {
      toast.error('Failed to update helpful count');
    }
  };

  const submitReview = async () => {
    if (!newReview.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const token = (session as any)?.accessToken;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/products/${params.id}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ productId: params.id, ...newReview }),
        },
      );

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Review submitted successfully!');
        setNewReview({ rating: 5, comment: '' });
        setCanReview(false);
        fetchReviews(params.id as string);
        fetchProduct(params.id as string);
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({ ...product, quantity: 1 });
      }
      toast.success(`Added ${quantity} item(s) to cart`);
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist({ ...product, quantity: 1 });
      toast.success('Added to wishlist');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({ ...product, quantity });
      window.location.href = '/checkout';
    }
  };





  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-20"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
              <div className="h-8 sm:h-10 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="space-y-3 mt-6">
                <div className="h-12 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Product not found</h1>
        <p className="text-sm sm:text-base text-muted-foreground">The product you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-blue-600 cursor-pointer">{product.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
              {/* Image Slider */}
              <div className="flex gap-4">
                {/* Thumbnail Column */}
                {product.images.length > 1 && (
                  <div className="flex flex-col gap-2 w-20">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-16 h-16 relative overflow-hidden rounded border-2 transition-all duration-300 ${
                          selectedImage === index 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Main Image */}
                <div className="flex-1">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-50 group">
                    <Image
                      src={product.images[selectedImage] || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-contain transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      priority
                      onLoad={() => setImageLoading(false)}
                      onLoadStart={() => setImageLoading(true)}
                    />
                    
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    )}
                    
                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white shadow-lg"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white shadow-lg"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {product.discount && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white text-sm font-semibold px-2 py-1">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToWishlist}
                  disabled={isInWishlist(product._id)}
                  className="flex-1"
                >
                  <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product._id) ? 'fill-current text-red-500' : ''}`} />
                  {isInWishlist(product._id) ? 'Wishlisted' : 'Wishlist'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    navigator.share ? 
                      navigator.share({ title: product.name, url: window.location.href }) :
                      navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied!'))
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Middle Column - Product Info */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {/* Brand & Category */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                <Badge variant="outline" className="text-xs">{product.brand}</Badge>
              </div>
              
              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-bold mb-4 leading-tight text-gray-900">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-sm">
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  <Star className="h-3 w-3 fill-current" />
                </div>
                <span className="text-sm text-gray-600">
                  {product.reviewCount} ratings & reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">₹{finalPrice.toLocaleString()}</span>
                  {product.discount && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {product.discount}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">In Stock</span>
                    <span className="text-gray-600">({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Key Features</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">Free Delivery</div>
                      <div className="text-xs text-gray-600">On orders above ₹500</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">1 Year Warranty</div>
                      <div className="text-xs text-gray-600">Manufacturer warranty</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <RotateCcw className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-sm">7 Days Return</div>
                      <div className="text-xs text-gray-600">Easy return policy</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Preview */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About this item</h3>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Options */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center border rounded-lg w-fit">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0 rounded-r-none"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="px-4 py-2 min-w-[60px] text-center font-medium border-x">{quantity}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="h-10 w-10 p-0 rounded-l-none"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Price</span>
                    <span className="text-xl font-bold">₹{(finalPrice * quantity).toLocaleString()}</span>
                  </div>
                  {product.discount && (
                    <div className="text-sm text-green-600">
                      You save ₹{((product.price - finalPrice) * quantity).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
                    size="lg"
                  >
                    Buy Now
                  </Button>
                  
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    variant="outline"
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>

                {/* Delivery Info */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-sm">Delivery by Tomorrow</div>
                      <div className="text-xs text-gray-600">Order within 12 hrs</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Sold by:</span> RoboSemi Electronics
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 lg:mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="description" className="text-xs sm:text-sm py-2 px-2 sm:px-4 transition-all duration-200 hover:scale-105">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="text-xs sm:text-sm py-2 px-2 sm:px-4 transition-all duration-200 hover:scale-105">
                <span className="hidden sm:inline">Specifications</span>
                <span className="sm:hidden">Specs</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm py-2 px-2 sm:px-4 transition-all duration-200 hover:scale-105">
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-4 sm:mt-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 border-b last:border-b-0 gap-1 sm:gap-2">
                      <span className="font-medium capitalize text-sm sm:text-base">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-sm sm:text-base text-muted-foreground sm:text-right">{value}</span>
                    </div>
                  ))}
                  {!product.specifications && (
                    <p className="text-muted-foreground col-span-full text-center py-8">
                      No specifications available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Review Summary */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl font-bold mb-2">{product.rating.toFixed(1)}</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground">{product.reviewCount} reviews</p>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Write Review */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Write a Review
                  </h3>
                  {!isAuthenticated ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Please log in to write a review</p>
                      <Button onClick={() => window.location.href = '/auth/login'}>Log In to Review</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-3 rounded-lg flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Reviewing as: <span className="font-medium text-foreground">{user?.name}</span></p>
                      </div>

                      <div>
                        <Label>Rating</Label>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                              className="transition-colors hover:scale-110"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  i < newReview.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground hover:text-yellow-400'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea
                          id="comment"
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Share your experience with this product..."
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <Button
                        onClick={submitReview}
                        disabled={submittingReview || !newReview.comment.trim()}
                        className="w-full md:w-auto"
                      >
                        {submittingReview ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Review
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reviews List */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                  {reviewsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 rounded-full p-2">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-semibold">{review.user.name}</h4>
                                {review.verifiedPurchase && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    ✓ Verified Purchase
                                  </span>
                                )}
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <p className="text-muted-foreground mb-3">{review.comment}</p>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => handleHelpful(review._id)}
                                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors hover:scale-105"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  Helpful ({review.helpful || 0})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="container mx-auto px-4 pb-10">
        <RecentlyViewedSection excludeId={product._id} />
      </div>

    </div>
  );
}