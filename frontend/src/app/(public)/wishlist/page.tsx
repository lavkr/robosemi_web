'use client';

import { useCart } from '@/hooks/useCart';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground">
              Save items you love to your wishlist and shop them later.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/products">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Button variant="outline" onClick={() => clearWishlist()}>
          Clear Wishlist
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product, index) => (
          <ProductCard key={`${product._id}-${index}`} product={product} />
        ))}
      </div>
    </div>
  );
}

