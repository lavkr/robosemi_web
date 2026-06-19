import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Clock, CheckCircle, AlertTriangle, FileText, Phone } from 'lucide-react';
import Link from 'next/link';

export default function WarrantyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
          Warranty Policy
        </Badge>
        <h1 className="heading-xl text-balance">
          Comprehensive <span className="text-gradient">Warranty Protection</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          We stand behind the quality of our products with comprehensive warranty coverage and dedicated support.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Warranty Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Warranty Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">1 Year Standard</h3>
                <p className="text-sm text-muted-foreground">Most products covered for 12 months</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Manufacturing Defects</h3>
                <p className="text-sm text-muted-foreground">Full coverage for factory defects</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Easy Claims</h3>
                <p className="text-sm text-muted-foreground">Simple online warranty claim process</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Periods */}
        <Card>
          <CardHeader>
            <CardTitle>Warranty Periods by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Product Category</th>
                    <th className="text-left p-3">Warranty Period</th>
                    <th className="text-left p-3">Coverage Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Arduino Boards</td>
                    <td className="p-3">12 months</td>
                    <td className="p-3">Manufacturing defects</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Raspberry Pi</td>
                    <td className="p-3">12 months</td>
                    <td className="p-3">Manufacturing defects</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Sensors</td>
                    <td className="p-3">6-12 months</td>
                    <td className="p-3">Functional defects</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Motors & Actuators</td>
                    <td className="p-3">12 months</td>
                    <td className="p-3">Mechanical & electrical</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Power Supplies</td>
                    <td className="p-3">24 months</td>
                    <td className="p-3">Full replacement</td>
                  </tr>
                  <tr>
                    <td className="p-3">Accessories</td>
                    <td className="p-3">6 months</td>
                    <td className="p-3">Manufacturing defects</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* What's Covered */}
        <Card>
          <CardHeader>
            <CardTitle>What's Covered Under Warranty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Covered Issues
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Manufacturing defects</li>
                  <li>• Component failures under normal use</li>
                  <li>• Electrical malfunctions</li>
                  <li>• Premature wear of parts</li>
                  <li>• Software bugs (for programmable devices)</li>
                  <li>• Performance issues below specifications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  Not Covered
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Physical damage from misuse</li>
                  <li>• Water or liquid damage</li>
                  <li>• Damage from incorrect wiring</li>
                  <li>• Normal wear and tear</li>
                  <li>• Damage from power surges</li>
                  <li>• Modifications or alterations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Claim Process */}
        <Card>
          <CardHeader>
            <CardTitle>How to Claim Warranty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                  <h4 className="font-semibold mb-1">Contact Support</h4>
                  <p className="text-xs text-muted-foreground">Email or call our support team</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                  <h4 className="font-semibold mb-1">Provide Details</h4>
                  <p className="text-xs text-muted-foreground">Order number and issue description</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                  <h4 className="font-semibold mb-1">Send Product</h4>
                  <p className="text-xs text-muted-foreground">Ship item to our service center</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                  <h4 className="font-semibold mb-1">Get Resolution</h4>
                  <p className="text-xs text-muted-foreground">Repair or replacement within 7-10 days</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Required Information for Claims</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Original order number or invoice</li>
                  <li>• Product serial number (if applicable)</li>
                  <li>• Detailed description of the issue</li>
                  <li>• Photos or videos of the problem</li>
                  <li>• Purchase date and retailer information</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extended Warranty */}
        <Card>
          <CardHeader>
            <CardTitle>Extended Warranty Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Extend your warranty coverage for additional peace of mind and protection.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Extended Warranty Plus</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Additional 12 months coverage</li>
                  <li>• Includes accidental damage</li>
                  <li>• Priority support</li>
                  <li>• Free shipping for repairs</li>
                </ul>
                <p className="text-sm font-semibold mt-2">Starting from ₹99</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Premium Care</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 24 months total coverage</li>
                  <li>• Comprehensive protection</li>
                  <li>• 24/7 technical support</li>
                  <li>• Advance replacement option</li>
                </ul>
                <p className="text-sm font-semibold mt-2">Starting from ₹199</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Warranty */}
        <Card>
          <CardHeader>
            <CardTitle>International Warranty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Our warranty coverage extends globally for your convenience.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Global Coverage</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Valid in 50+ countries</li>
                  <li>• Local service centers available</li>
                  <li>• Same warranty terms apply</li>
                  <li>• Multi-language support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Service Locations</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• India: Mumbai, Delhi, Bangalore</li>
                  <li>• USA: California, Texas, New York</li>
                  <li>• Europe: London, Berlin, Paris</li>
                  <li>• Asia: Singapore, Tokyo, Seoul</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Warranty Support Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Our dedicated warranty support team is ready to assist you with any warranty-related questions or claims.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Phone className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Phone Support</h4>
                <p className="text-sm text-muted-foreground">+91 92880 72525</p>
                <p className="text-xs text-muted-foreground">Mon-Fri: 9AM-6PM IST</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Email Support</h4>
                <p className="text-sm text-muted-foreground">warranty@robosemi.in</p>
                <p className="text-xs text-muted-foreground">24-48 hour response</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Online Portal</h4>
                <p className="text-sm text-muted-foreground">Track warranty status</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href="/warranty-policy-check">Check Status</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}