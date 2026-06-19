'use client';

import { apiUrl } from '@/utils/api-url';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Users, TrendingDown, Clock, CheckCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function BulkOrdersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    orderType: '',
    quantity: '',
    products: '',
    timeline: '',
    budget: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/leads'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'bulk_orders',
          interests: ['bulk_orders'],
          notes: `Bulk Order Request: ${formData.message}`,
        }),
      });

      if (response.ok) {
        toast.success('Bulk order request submitted! We\'ll contact you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          orderType: '',
          quantity: '',
          products: '',
          timeline: '',
          budget: '',
          message: ''
        });
      } else {
        toast.error('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting bulk order request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: TrendingDown,
      title: 'Volume Discounts',
      description: 'Up to 30% off on bulk orders',
      color: 'text-green-600'
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Personal account manager',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Priority Processing',
      description: 'Faster order fulfillment',
      color: 'text-purple-600'
    },
    {
      icon: Package,
      title: 'Custom Packaging',
      description: 'Branded packaging options',
      color: 'text-orange-600'
    }
  ];

  const discountTiers = [
    { quantity: '50-99 units', discount: '5%', savings: 'Up to ₹5,000' },
    { quantity: '100-499 units', discount: '10%', savings: 'Up to ₹25,000' },
    { quantity: '500-999 units', discount: '15%', savings: 'Up to ₹75,000' },
    { quantity: '1000+ units', discount: '20-30%', savings: 'Up to ₹2,00,000+' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
          Bulk Orders
        </Badge>
        <h1 className="heading-xl text-balance">
          Special Pricing for <span className="text-gradient">Bulk Orders</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Get competitive pricing, dedicated support, and priority processing for your large quantity orders.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card key={index} className="card-hover text-center">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                    <Icon className={`h-6 w-6 ${benefit.color}`} />
                  </div>
                </div>
                <h3 className="font-semibold">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bulk Order Form */}
        <Card>
          <CardHeader>
            <CardTitle>Request Bulk Order Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company/Organization *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select value={formData.orderType} onValueChange={(value) => handleInputChange('orderType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="educational">Educational Institution</SelectItem>
                      <SelectItem value="corporate">Corporate Purchase</SelectItem>
                      <SelectItem value="reseller">Reseller/Distributor</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="government">Government/Public Sector</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Estimated Quantity *</Label>
                  <Input
                    id="quantity"
                    placeholder="e.g., 100 units"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="products">Products Needed *</Label>
                <Textarea
                  id="products"
                  placeholder="List the products you need with quantities..."
                  value={formData.products}
                  onChange={(e) => handleInputChange('products', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeline">Required Timeline</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (1-2 weeks)</SelectItem>
                      <SelectItem value="month">Within 1 month</SelectItem>
                      <SelectItem value="quarter">Within 3 months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                      <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="1l-5l">₹1,00,000 - ₹5,00,000</SelectItem>
                      <SelectItem value="5l-10l">₹5,00,000 - ₹10,00,000</SelectItem>
                      <SelectItem value="above-10l">Above ₹10,00,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Additional Requirements</Label>
                <Textarea
                  id="message"
                  placeholder="Any specific requirements, customizations, or questions..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full btn-gradient" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Request Quote'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Discount Tiers & Info */}
        <div className="space-y-6">
          {/* Discount Tiers */}
          <Card>
            <CardHeader>
              <CardTitle>Volume Discount Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discountTiers.map((tier, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold">{tier.quantity}</div>
                      <div className="text-sm text-muted-foreground">{tier.savings}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                      {tier.discount}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Discounts are calculated based on total order value and may vary by product category.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Process */}
          <Card>
            <CardHeader>
              <CardTitle>Our Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Submit Request</h4>
                    <p className="text-sm text-muted-foreground">Fill out the form with your requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Quote Preparation</h4>
                    <p className="text-sm text-muted-foreground">We prepare a detailed quote within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Discussion & Finalization</h4>
                    <p className="text-sm text-muted-foreground">Review terms and finalize the order</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Order Fulfillment</h4>
                    <p className="text-sm text-muted-foreground">Priority processing and delivery</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Need Immediate Assistance?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Bulk Orders Hotline</p>
                  <p className="text-sm text-muted-foreground">+91 92880 72525</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">bulk@robosemi.in</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Stories */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Success Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">IIT Mumbai</h4>
              <p className="text-sm text-muted-foreground">5,000 Arduino boards for student labs</p>
              <p className="text-xs text-green-600 font-semibold">25% savings achieved</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">TechCorp Industries</h4>
              <p className="text-sm text-muted-foreground">10,000 sensors for production line</p>
              <p className="text-xs text-green-600 font-semibold">30% savings achieved</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">Smart City Project</h4>
              <p className="text-sm text-muted-foreground">50,000 IoT devices deployment</p>
              <p className="text-xs text-green-600 font-semibold">₹15L+ savings achieved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}