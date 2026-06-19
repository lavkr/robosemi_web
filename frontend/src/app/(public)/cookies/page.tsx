import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cookie, Settings, Shield, Eye, BarChart3, Target } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
          Cookie Policy
        </Badge>
        <h1 className="heading-xl text-balance">
          Our <span className="text-gradient">Cookie Policy</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Learn how we use cookies to enhance your browsing experience and improve our services.
        </p>
        <p className="text-sm text-muted-foreground">
          Last updated: January 1, 2024
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* What Are Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better browsing experience by remembering your preferences 
              and analyzing how you use our site.
            </p>
            <p>
              Cookies contain information that is transferred to your device's hard drive and stored there. 
              They do not contain any personal information that can identify you directly.
            </p>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Essential Cookies</h3>
                  <Badge variant="secondary">Always Active</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Authentication and security</li>
                  <li>• Shopping cart functionality</li>
                  <li>• Form submissions</li>
                  <li>• Session management</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Analytics Cookies</h3>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  Help us understand how visitors interact with our website by collecting anonymous information.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Page views and traffic sources</li>
                  <li>• User behavior patterns</li>
                  <li>• Website performance metrics</li>
                  <li>• Error tracking and debugging</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Marketing Cookies</h3>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Personalized advertisements</li>
                  <li>• Social media integration</li>
                  <li>• Campaign performance tracking</li>
                  <li>• Retargeting and remarketing</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Preference Cookies</h3>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  Remember your settings and preferences to provide a personalized experience.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Language and region preferences</li>
                  <li>• Theme and display settings</li>
                  <li>• Saved search filters</li>
                  <li>• Wishlist and favorites</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Third-Party Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may use third-party services that place cookies on your device. These services help us 
              provide better functionality and analyze our website performance.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Google Analytics</h4>
                <p className="text-sm text-muted-foreground">Website traffic and user behavior analysis</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Razorpay</h4>
                <p className="text-sm text-muted-foreground">Secure payment processing</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cloudinary</h4>
                <p className="text-sm text-muted-foreground">Image optimization and delivery</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Social Media</h4>
                <p className="text-sm text-muted-foreground">Social sharing and integration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Managing Your Cookie Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You have control over which cookies you accept. You can manage your preferences through:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Browser Settings</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Most browsers allow you to control cookies through their settings:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Block all cookies</li>
                  <li>• Block third-party cookies only</li>
                  <li>• Delete existing cookies</li>
                  <li>• Receive notifications when cookies are set</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cookie Banner</h4>
                <p className="text-sm text-muted-foreground">
                  When you first visit our website, you'll see a cookie banner where you can accept or 
                  customize your cookie preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact of Disabling Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Impact of Disabling Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              While you can disable cookies, please note that this may affect your browsing experience:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• You may need to re-enter information repeatedly</li>
              <li>• Some website features may not work properly</li>
              <li>• Your preferences won't be remembered</li>
              <li>• Shopping cart functionality may be limited</li>
              <li>• You may see less relevant content and advertisements</li>
            </ul>
          </CardContent>
        </Card>

        {/* Updates to Cookie Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Updates to This Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this cookie policy from time to time to reflect changes in our practices 
              or applicable laws. Any changes will be posted on this page with an updated revision date.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> privacy@robosemi.in</p>
              <p><strong>Phone:</strong> +91 92880 72525</p>
              <p><strong>Address:</strong> RoboSemi Technologies, Mumbai, Maharashtra 400001, India</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}