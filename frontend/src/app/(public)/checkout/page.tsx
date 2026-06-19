'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Truck } from 'lucide-react';
import { toast } from 'sonner';

interface ShippingRate {
  id: number;
  name: string;
  rate: number;
  cod: boolean;
  deliveryDays: string;
  description: string;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  weight?: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { cart, getCartTotal, clearCart, directPurchaseItem, setDirectPurchaseItem, getDirectPurchaseTotal, appliedCoupon, getCouponDiscount } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [billingAddress, setBillingAddress] = useState({
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [notes, setNotes] = useState('');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isDirect, setIsDirect] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);

  const subtotal = isDirect ? getDirectPurchaseTotal() : getCartTotal();
  const discount = getCouponDiscount();
  const shippingCost = selectedShippingRate ? selectedShippingRate.rate : (subtotal > 500 ? 0 : 50);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal - discount + shippingCost + tax;
  
  const items = isDirect && directPurchaseItem ? [directPurchaseItem] : cart;

  useEffect(() => {
    // Check if this is a direct purchase
    const urlParams = new URLSearchParams(window.location.search);
    const isDirectPurchase = urlParams.get('direct') === 'true';
    setIsDirect(isDirectPurchase);

    if (isLoading) return;

    if (!user) {
      const redirect = isDirectPurchase ? '/checkout?direct=true' : '/checkout';
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    if (isDirectPurchase && !directPurchaseItem) {
      router.push('/products');
      return;
    }

    if (!isDirectPurchase && cart.length === 0) {
      router.push('/cart');
      return;
    }
  }, [user, cart, router, directPurchaseItem, isLoading]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress);
    }
  }, [sameAsShipping, shippingAddress]);

  const calculateShippingRates = async () => {
    if (!shippingAddress.zipCode || shippingAddress.zipCode.length < 6) return;
    
    setLoadingRates(true);
    try {
      const totalWeight = items.reduce((weight, item) => {
        return weight + ((item as any).weight || 0.5) * item.quantity;
      }, 0);

      const response = await fetch(apiUrl('/shipping/calculate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickupPostcode: '400001', // Default Mumbai pincode
          deliveryPostcode: shippingAddress.zipCode,
          weight: Math.max(totalWeight, 0.5),
          cod: paymentMethod === 'cod'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.available && data.rates.length > 0) {
          setShippingRates(data.rates);
          setSelectedShippingRate(data.rates[0]); // Select first rate by default
        }
      }
    } catch (error) {
      console.error('Error calculating shipping rates:', error);
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateShippingRates();
    }, 500);
    return () => clearTimeout(timer);
  }, [shippingAddress.zipCode, paymentMethod]);

  const handleInputChange = (
    type: 'shipping' | 'billing',
    field: string,
    value: string
  ) => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'phone', 'street', 'city', 'state', 'zipCode'];
    
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        toast.error(`Please fill in the shipping ${field}`);
        return false;
      }
    }

    if (!sameAsShipping) {
      for (const field of requiredFields) {
        if (!billingAddress[field as keyof typeof billingAddress]) {
          toast.error(`Please fill in the billing ${field}`);
          return false;
        }
      }
    }

    return true;
  };

  const createOrder = async () => {
    try {
      const orderData = {
        items: items.map(item => ({
          product: item._id,
          name: item.name,
          price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        subtotal,
        discount,
        shippingCost,
        tax,
        total,
        paymentMethod,
        notes,
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          type: appliedCoupon.type,
          value: appliedCoupon.value,
          discountAmount: discount
        } : null,
        shippingRate: selectedShippingRate,
      };

      const response = await fetch(apiUrl('/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async (order: any) => {
    try {
      // Create Razorpay order
      const paymentResponse = await fetch(apiUrl('/payment/create-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          receipt: order.orderNumber,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const paymentData = await paymentResponse.json();

      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'RoboSemi',
        description: `Order #${order.orderNumber}`,
        order_id: paymentData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch(apiUrl('/payment/verify'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order._id,
              }),
            });

            if (verifyResponse.ok) {
              if (isDirect) {
                setDirectPurchaseItem(null);
              } else {
                clearCart();
              }
              toast.success('Payment successful!');
              router.push(`/account/orders/${order._id}`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#2563EB',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      toast.error('Failed to initiate payment');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const order = await createOrder();

      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(order);
      } else {
        // COD
        if (isDirect) {
          setDirectPurchaseItem(null);
        } else {
          clearCart();
        }
        toast.success('Order placed successfully!');
        router.push(`/account/orders/${order._id}`);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  if (!user || (!isDirect && cart.length === 0) || (isDirect && !directPurchaseItem)) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isDirect ? 'Buy Now - Checkout' : 'Checkout'}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping-name">Full Name *</Label>
                    <Input
                      id="shipping-name"
                      value={shippingAddress.name}
                      onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-phone">Phone Number *</Label>
                    <Input
                      id="shipping-phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="shipping-street">Street Address *</Label>
                  <Input
                    id="shipping-street"
                    value={shippingAddress.street}
                    onChange={(e) => handleInputChange('shipping', 'street', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shipping-city">City *</Label>
                    <Input
                      id="shipping-city"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-state">State *</Label>
                    <Input
                      id="shipping-state"
                      value={shippingAddress.state}
                      onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-zip">ZIP Code *</Label>
                    <Input
                      id="shipping-zip"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="same-as-shipping"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="same-as-shipping">Same as shipping address</Label>
                </div>

                {!sameAsShipping && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billing-name">Full Name *</Label>
                        <Input
                          id="billing-name"
                          value={billingAddress.name}
                          onChange={(e) => handleInputChange('billing', 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-phone">Phone Number *</Label>
                        <Input
                          id="billing-phone"
                          type="tel"
                          value={billingAddress.phone}
                          onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="billing-street">Street Address *</Label>
                      <Input
                        id="billing-street"
                        value={billingAddress.street}
                        onChange={(e) => handleInputChange('billing', 'street', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billing-city">City *</Label>
                        <Input
                          id="billing-city"
                          value={billingAddress.city}
                          onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-state">State *</Label>
                        <Input
                          id="billing-state"
                          value={billingAddress.state}
                          onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-zip">ZIP Code *</Label>
                        <Input
                          id="billing-zip"
                          value={billingAddress.zipCode}
                          onChange={(e) => handleInputChange('billing', 'zipCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Shipping Options */}
            {shippingRates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={selectedShippingRate?.id?.toString()} 
                    onValueChange={(value) => {
                      const rate = shippingRates.find(r => r.id.toString() === value);
                      setSelectedShippingRate(rate || null);
                    }}
                  >
                    {shippingRates.map((rate) => (
                      <div key={rate.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={rate.id.toString()} id={`rate-${rate.id}`} />
                        <Label htmlFor={`rate-${rate.id}`} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{rate.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Delivery in {rate.deliveryDays}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">₹{rate.rate}</div>
                              {rate.cod && paymentMethod === 'cod' && (
                                <Badge variant="outline" className="text-xs">COD Available</Badge>
                              )}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {loadingRates && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Calculating shipping rates...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex items-center gap-2">
                      Online Payment (Razorpay)
                      <Badge variant="secondary">Recommended</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions for your order..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const finalPrice = item.discount 
                      ? item.price * (1 - item.discount / 100)
                      : item.price;
                    
                    return (
                      <div key={item._id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <div className="font-medium line-clamp-1">{item.name}</div>
                          <div className="text-muted-foreground">
                            Qty: {item.quantity} × ₹{finalPrice.toLocaleString()}
                          </div>
                        </div>
                        <div className="font-medium">
                          ₹{(finalPrice * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discount > 0 && appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Place Order - ₹${total.toLocaleString()}`
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}