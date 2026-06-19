'use client';

import { apiUrl } from '@/utils/api-url';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, appliedCoupon, setAppliedCoupon, removeCoupon, getCouponDiscount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  
  const subtotal = getCartTotal();
  const discount = getCouponDiscount();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + shipping;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    try {
      const response = await fetch(apiUrl('/coupons/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderValue: subtotal })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAppliedCoupon(data.coupon);
        setCouponCode('');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Looks like you haven't added any items to your cart yet.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/products">
              Continue Shopping
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
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="outline" onClick={() => clearCart()}>
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const finalPrice = item.discount 
              ? item.price * (1 - item.discount / 100)
              : item.price;

            return (
              <Card key={`${item._id}-${index}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative w-full md:w-24 h-48 md:h-24 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item._id}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item._id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          ₹{finalPrice.toLocaleString()}
                        </span>
                        {item.discount && (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {item.discount}% off
                            </Badge>
                          </>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-bold">
                            ₹{(finalPrice * item.quantity).toLocaleString()}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-muted-foreground">
                              ₹{finalPrice.toLocaleString()} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Coupon Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Coupon Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                  />
                  <Button onClick={applyCoupon} disabled={couponLoading}>
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
              ) : (
                <div className={`flex items-center justify-between p-3 border rounded-lg ${
                  discount > 0 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Tag className={`h-4 w-4 ${
                      discount > 0 ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      discount > 0 ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {discount > 0 
                        ? `${appliedCoupon.code} applied (-₹${discount})`
                        : `${appliedCoupon.code} (Min order: ₹${appliedCoupon.minOrderValue})`
                      }
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Try "SAVE10" for 10% off
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Secure checkout with SSL encryption
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}