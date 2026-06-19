import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Scale, Shield, AlertTriangle, CreditCard, Truck } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
          Terms & Conditions
        </Badge>
        <h1 className="heading-xl text-balance">
          Terms of <span className="text-gradient">Service</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Please read these terms and conditions carefully before using our services.
        </p>
        <p className="text-sm text-muted-foreground">
          Last updated: January 1, 2024
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              By accessing and using the RoboSemi website and services, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        {/* Use License */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Use License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Permission is granted to temporarily download one copy of the materials on RoboSemi's website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li>• modify or copy the materials</li>
              <li>• use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>• attempt to decompile or reverse engineer any software contained on the website</li>
              <li>• remove any copyright or other proprietary notations from the materials</li>
            </ul>
            <p className="text-muted-foreground">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by RoboSemi at any time.
            </p>
          </CardContent>
        </Card>

        {/* Account Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• You are responsible for safeguarding the password and for all activities under your account</li>
              <li>• You must notify us immediately of any unauthorized use of your account</li>
              <li>• We reserve the right to refuse service or terminate accounts at our sole discretion</li>
              <li>• One person or legal entity may not maintain more than one account</li>
            </ul>
          </CardContent>
        </Card>

        {/* Products and Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Products and Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Product Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• We strive to display product colors and images as accurately as possible</li>
                <li>• We do not warrant that product descriptions are accurate, complete, or error-free</li>
                <li>• We reserve the right to discontinue any product at any time</li>
                <li>• Prices are subject to change without notice</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Availability</h3>
              <p className="text-muted-foreground">
                All products are subject to availability. We will notify you as soon as possible if a product becomes unavailable after you place an order.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing and Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pricing and Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-muted-foreground">
              <li>• All prices are listed in Indian Rupees (INR) and include applicable taxes</li>
              <li>• Payment is due at the time of purchase</li>
              <li>• We accept major credit cards, debit cards, UPI, and cash on delivery</li>
              <li>• We reserve the right to refuse or cancel orders for any reason</li>
              <li>• In case of pricing errors, we reserve the right to cancel the order</li>
            </ul>
          </CardContent>
        </Card>

        {/* Shipping and Delivery */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping and Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-muted-foreground">
              <li>• Shipping costs are calculated based on weight, dimensions, and destination</li>
              <li>• Free shipping is available on orders above ₹500 within India</li>
              <li>• Delivery times are estimates and not guaranteed</li>
              <li>• Risk of loss passes to you upon delivery to the carrier</li>
              <li>• International shipping may be subject to customs duties and taxes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Returns and Refunds */}
        <Card>
          <CardHeader>
            <CardTitle>Returns and Refunds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Return Policy</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Items may be returned within 30 days of delivery</li>
                <li>• Items must be in original condition and packaging</li>
                <li>• Custom or personalized items cannot be returned</li>
                <li>• Return shipping costs may apply unless the item is defective</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Refund Process</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Refunds will be processed within 5-7 business days</li>
                <li>• Refunds will be issued to the original payment method</li>
                <li>• Shipping charges are non-refundable unless we made an error</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Warranties */}
        <Card>
          <CardHeader>
            <CardTitle>Warranties and Disclaimers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Product Warranties</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Products are covered by manufacturer warranties where applicable</li>
                <li>• Warranty terms vary by product and manufacturer</li>
                <li>• We will facilitate warranty claims but are not responsible for manufacturer warranty terms</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Disclaimers</h3>
              <p className="text-muted-foreground">
                The materials on RoboSemi's website are provided on an 'as is' basis. RoboSemi makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including without limitation, 
                implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
                of intellectual property or other violation of rights.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              In no event shall RoboSemi or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on RoboSemi's website, even if RoboSemi or an authorized representative has been 
              notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow 
              limitations on implied warranties, or limitations of liability for consequential or incidental damages, 
              these limitations may not apply to you.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These terms and conditions are governed by and construed in accordance with the laws of India, 
              and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              RoboSemi may revise these terms of service at any time without notice. By using this website, 
              you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> legal@robosemi.in</p>
              <p><strong>Phone:</strong> +91 92880 72525</p>
              <p><strong>Address:</strong> RoboSemi Technologies, Mumbai, Maharashtra 400001, India</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}