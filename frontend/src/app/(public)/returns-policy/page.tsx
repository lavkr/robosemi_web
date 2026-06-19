import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Clock, CheckCircle, XCircle, Package, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
          Returns & Refunds
        </Badge>
        <h1 className="heading-xl text-balance">
          Hassle-Free <span className="text-gradient">Returns</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          We want you to be completely satisfied with your purchase. Our flexible return policy ensures peace of mind.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Return Policy Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Return Policy Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">30-Day Returns</h3>
                <p className="text-sm text-muted-foreground">Return items within 30 days of delivery</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Original Condition</h3>
                <p className="text-sm text-muted-foreground">Items must be unused and in original packaging</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Free Returns</h3>
                <p className="text-sm text-muted-foreground">Free return shipping for defective items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Returnable Items */}
        <Card>
          <CardHeader>
            <CardTitle>What Can Be Returned?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Returnable Items
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Unused products in original packaging</li>
                  <li>• Items with all accessories and manuals</li>
                  <li>• Products with original tags/labels</li>
                  <li>• Defective or damaged items</li>
                  <li>• Wrong items shipped</li>
                  <li>• Items not as described</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Non-Returnable Items
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Custom or personalized products</li>
                  <li>• Software or digital downloads</li>
                  <li>• Items damaged by misuse</li>
                  <li>• Products without original packaging</li>
                  <li>• Items returned after 30 days</li>
                  <li>• Consumable items (batteries, etc.)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card>
          <CardHeader>
            <CardTitle>How to Return an Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                  <h4 className="font-semibold mb-1">Initiate Return</h4>
                  <p className="text-xs text-muted-foreground">Contact us or use online return form</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                  <h4 className="font-semibold mb-1">Get Return Label</h4>
                  <p className="text-xs text-muted-foreground">We'll email you a prepaid return label</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                  <h4 className="font-semibold mb-1">Pack & Ship</h4>
                  <p className="text-xs text-muted-foreground">Pack item securely and ship back</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                  <h4 className="font-semibold mb-1">Get Refund</h4>
                  <p className="text-xs text-muted-foreground">Refund processed within 5-7 days</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild className="btn-gradient">
                  <Link href="/contact">Start Return Process</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Information */}
        <Card>
          <CardHeader>
            <CardTitle>Refund Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Refund Timeline</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Processing: 1-2 business days after receipt</li>
                  <li>• Credit Card: 3-5 business days</li>
                  <li>• Debit Card: 5-7 business days</li>
                  <li>• UPI/Wallet: 1-3 business days</li>
                  <li>• Bank Transfer: 3-7 business days</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Refund Method</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Same payment method used for purchase</li>
                  <li>• Full refund for defective items</li>
                  <li>• Shipping charges refunded if our error</li>
                  <li>• Partial refunds for damaged packaging</li>
                  <li>• Store credit option available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We offer exchanges for defective items or wrong products shipped. Exchanges are subject to stock availability.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Same Product Exchange</h4>
                <p className="text-sm text-muted-foreground">
                  Exchange for the same product if defective or damaged during shipping.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Different Product Exchange</h4>
                <p className="text-sm text-muted-foreground">
                  Exchange for a different product of equal or higher value (pay difference).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Returns */}
        <Card>
          <CardHeader>
            <CardTitle>Warranty Returns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Products under warranty can be returned for repair or replacement even after the 30-day return period.</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Warranty Coverage</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Manufacturing defects covered</li>
                <li>• Free repair or replacement</li>
                <li>• Warranty period varies by product</li>
                <li>• Original purchase receipt required</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help with Returns?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Our customer service team is here to help you with any return or refund questions.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Email Support</h4>
                <p className="text-sm text-muted-foreground">returns@robosemi.in</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Phone Support</h4>
                <p className="text-sm text-muted-foreground">+91 92880 72525</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Support Hours</h4>
                <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM IST</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}