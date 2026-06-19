'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { cn } from '@/utils/utils';

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useAuth();
  const { trackProductView, trackAddToCart } = useAnalytics();
  
  const isWishlisted = isInWishlist(product._id);
  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      _id: product._id,
      name: product.name,
      price: finalPrice,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: 1
    });
    trackAddToCart(product._id);
  };

  const handleProductClick = () => {
    trackProductView(product._id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/placeholder.jpg',
        category: product.category || '',
        rating: product.rating || 0,
        reviews: product.reviewCount || 0,
        discount: product.discount,
        inStock: product.inStock !== false,
        quantity: 1
      });
    }
  };

  return (
    <div className={cn("group bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden", className)}>
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/products/${product._id}`} onClick={handleProductClick}>
          {/* Product Image */}
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className={cn(
              "object-contain p-4 transition-all duration-300 group-hover:scale-105",
              isImageLoading ? "blur-sm" : "blur-0"
            )}
            onLoad={() => setIsImageLoading(false)}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {product.discount && (
            <Badge className="bg-red-500 text-white text-xs font-semibold px-2 py-1">
              {product.discount}% OFF
            </Badge>
          )}
          {product.inStock === false && (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2">
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm",
              "opacity-0 group-hover:opacity-100 transition-all duration-300"
            )}
            onClick={handleToggleWishlist}
          >
            <Heart className={cn(
              "h-4 w-4 transition-colors",
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            )} />
          </Button>
        </div>
      </div>

      <div className="p-3">
        <Link href={`/products/${product._id}`} onClick={handleProductClick}>
          {/* Product Name */}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {(product.rating || 0) > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs">
              <span className="font-semibold">{(product.rating || 0).toFixed(1)}</span>
              <Star className="h-2.5 w-2.5 fill-current" />
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{finalPrice.toLocaleString()}
            </span>
            {product.discount && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          className={cn(
            "w-full text-sm font-medium transition-all duration-200",
            product.inStock === false 
              ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
              : "bg-orange-500 hover:bg-orange-600 text-white hover:shadow-md"
          )}
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock !== false ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}