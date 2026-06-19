'use client';

import { apiUrl } from '@/utils/api-url';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface WishlistItem {
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

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(apiUrl('/wishlist'));
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlist || []);
      } else {
        throw new Error('Failed to fetch wishlist');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to fetch wishlist');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchWishlist();
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
      image: item.images?.[0] || '/placeholder-product.jpg',
      quantity: 1,
    });
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">
          Items you've saved for later ({wishlistItems.length})
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground">
              Save items you love to your wishlist
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const finalPrice = item.discount 
              ? item.price * (1 - item.discount / 100) 
              : item.price;

            return (
              <Card key={item._id} className="group">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={item.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {item.discount && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        -{item.discount}%
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    
                    <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({item.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        ₹{finalPrice.toLocaleString()}
                      </span>
                      {item.discount && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{item.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}