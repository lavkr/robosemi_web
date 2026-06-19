import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, MapPin, Package, Shield, CreditCard } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
          Shipping Policy
        </Badge>
        <h1 className="heading-xl text-balance">
          Fast & <span className="text-gradient">Reliable Shipping</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          We ensure your orders reach you quickly and safely with our comprehensive shipping solutions.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Shipping Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Standard Shipping
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Delivery: 3-5 business days</li>
                  <li>• Cost: ₹50 (Free on orders ₹500+)</li>
                  <li>• Tracking included</li>
                  <li>• Available across India</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  Express Shipping
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Delivery: 1-2 business days</li>
                  <li>• Cost: ₹150</li>
                  <li>• Priority handling</li>
                  <li>• Major cities only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card>
          <CardHeader>
            <CardTitle>Order Processing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>All orders are processed within 1-2 business days. Orders placed after 2 PM IST will be processed the next business day.</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold">Order Placed</div>
                <div className="text-sm text-muted-foreground">Confirmation sent</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold">Processing</div>
                <div className="text-sm text-muted-foreground">1-2 business days</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold">Shipped</div>
                <div className="text-sm text-muted-foreground">Tracking provided</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Domestic Shipping (India)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All major cities and towns</li>
                  <li>• Remote areas (additional 1-2 days)</li>
                  <li>• Cash on Delivery available</li>
                  <li>• Free shipping on orders ₹500+</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">International Shipping</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 50+ countries supported</li>
                  <li>• 7-15 business days delivery</li>
                  <li>• Customs duties may apply</li>
                  <li>• Tracking included</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Charges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Shipping Charges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Order Value</th>
                    <th className="text-left p-2">Standard Shipping</th>
                    <th className="text-left p-2">Express Shipping</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Below ₹500</td>
                    <td className="p-2">₹50</td>
                    <td className="p-2">₹150</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">₹500 - ₹2000</td>
                    <td className="p-2 text-green-600 font-semibold">Free</td>
                    <td className="p-2">₹100</td>
                  </tr>
                  <tr>
                    <td className="p-2">Above ₹2000</td>
                    <td className="p-2 text-green-600 font-semibold">Free</td>
                    <td className="p-2 text-green-600 font-semibold">Free</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Packaging</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Secure anti-static packaging</li>
                  <li>• Fragile items extra protected</li>
                  <li>• Eco-friendly materials used</li>
                  <li>• Branded packaging</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Delivery</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Signature required for delivery</li>
                  <li>• Safe drop-off if unavailable</li>
                  <li>• SMS/Email notifications</li>
                  <li>• Real-time tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              For any shipping-related queries, please contact our customer support team.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Track Your Order</p>
                  <p className="text-sm text-muted-foreground">Get real-time updates</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Shipping Support</p>
                  <p className="text-sm text-muted-foreground">+91 92880 72525</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}