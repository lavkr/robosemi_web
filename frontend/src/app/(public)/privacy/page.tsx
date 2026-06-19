import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, UserCheck, Database, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
          Privacy Policy
        </Badge>
        <h1 className="heading-xl text-balance">
          Your <span className="text-gradient">Privacy Matters</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          We are committed to protecting your privacy and ensuring the security of your personal information.
        </p>
        <p className="text-sm text-muted-foreground">
          Last updated: January 1, 2024
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              RoboSemi Technologies ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
            </p>
            <p>
              This policy applies to all information collected through our website, mobile applications, and any related services, 
              sales, marketing, or events.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Name, email address, and phone number</li>
                <li>• Billing and shipping addresses</li>
                <li>• Payment information (processed securely through third-party providers)</li>
                <li>• Account credentials and preferences</li>
                <li>• Communication history and support interactions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Automatically Collected Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• IP address and device information</li>
                <li>• Browser type and version</li>
                <li>• Pages visited and time spent on our website</li>
                <li>• Referring website and search terms</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li>• <strong>Order Processing:</strong> To process and fulfill your orders, including payment processing and shipping</li>
              <li>• <strong>Customer Service:</strong> To provide customer support and respond to your inquiries</li>
              <li>• <strong>Account Management:</strong> To create and manage your account and preferences</li>
              <li>• <strong>Marketing:</strong> To send promotional emails and newsletters (with your consent)</li>
              <li>• <strong>Website Improvement:</strong> To analyze usage patterns and improve our website and services</li>
              <li>• <strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              <li>• <strong>Security:</strong> To protect against fraud and unauthorized access</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website and conducting business</li>
              <li>• <strong>Payment Processors:</strong> With secure payment processing companies to handle transactions</li>
              <li>• <strong>Shipping Partners:</strong> With logistics companies to deliver your orders</li>
              <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li>• <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• SSL encryption for data transmission</li>
              <li>• Secure servers and databases</li>
              <li>• Regular security audits and updates</li>
              <li>• Access controls and employee training</li>
              <li>• PCI DSS compliance for payment processing</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Your Rights and Choices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li>• <strong>Access:</strong> Request access to your personal information</li>
              <li>• <strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
              <li>• <strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li>• <strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li>• <strong>Cookies:</strong> Manage cookie preferences through your browser settings</li>
            </ul>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              International Data Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure that such transfers are conducted in accordance with applicable data protection laws 
              and that appropriate safeguards are in place to protect your information.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Essential Cookies</h4>
                <p className="text-sm text-muted-foreground">Required for website functionality and security</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground">Help us understand how visitors use our website</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Marketing Cookies</h4>
                <p className="text-sm text-muted-foreground">Used to deliver relevant advertisements</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preference Cookies</h4>
                <p className="text-sm text-muted-foreground">Remember your settings and preferences</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. 
              We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
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
              If you have any questions about this privacy policy or our data practices, please contact us:
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