import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail,
  FileText,
  Truck,
  CreditCard,
  Shield,
  RotateCcw,
  Settings
} from 'lucide-react';
import Link from 'next/link';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    icon: Truck,
    color: 'text-blue-600',
    faqs: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days.'
      },
      {
        question: 'Do you offer free shipping?',
        answer: 'Yes, we offer free shipping on orders above ₹500 within India.'
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes, you can track your order using the tracking number sent to your email.'
      }
    ]
  },
  {
    title: 'Payments',
    icon: CreditCard,
    color: 'text-green-600',
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards, UPI, net banking, and cash on delivery.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, all payments are processed through secure, encrypted channels.'
      },
      {
        question: 'Can I pay cash on delivery?',
        answer: 'Yes, COD is available for orders within India with a small additional fee.'
      }
    ]
  },
  {
    title: 'Returns & Refunds',
    icon: RotateCcw,
    color: 'text-purple-600',
    faqs: [
      {
        question: 'What is your return policy?',
        answer: '30-day return policy for unused items in original packaging.'
      },
      {
        question: 'How do I return an item?',
        answer: 'Contact our support team to initiate a return and get a return label.'
      },
      {
        question: 'When will I get my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive the returned item.'
      }
    ]
  },
  {
    title: 'Technical Support',
    icon: Settings,
    color: 'text-orange-600',
    faqs: [
      {
        question: 'Do you provide technical documentation?',
        answer: 'Yes, comprehensive documentation is available for all our products.'
      },
      {
        question: 'Can you help with product selection?',
        answer: 'Our technical team can help you choose the right components for your project.'
      },
      {
        question: 'Do you offer installation support?',
        answer: 'We provide detailed guides and can connect you with certified installers.'
      }
    ]
  }
];

const quickLinks = [
  { title: 'Order Status', href: '/track-order', icon: Truck },
  { title: 'Returns', href: '/returns', icon: RotateCcw },
  { title: 'Warranty', href: '/warranty-policy', icon: Shield },
  { title: 'Contact Us', href: '/contact', icon: MessageSquare },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
          Help Center
        </Badge>
        <h1 className="heading-xl text-balance">
          How can we <span className="text-gradient">help you?</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Find answers to common questions, get technical support, and learn more about our products and services.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help articles, guides, or FAQs..."
            className="pl-12 h-14 text-lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link key={index} href={link.href}>
              <Card className="card-hover h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold">{link.title}</h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {faqCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${category.color}`} />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <div key={faqIndex} className="space-y-2">
                      <h4 className="font-semibold flex items-start gap-2">
                        <HelpCircle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        {faq.question}
                      </h4>
                      <p className="text-muted-foreground ml-6">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Contact Support */}
      <Card className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center space-y-6">
          <MessageSquare className="h-12 w-12 text-primary mx-auto" />
          <div>
            <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is available 24/7 to help you with any questions or issues.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button size="lg" asChild className="btn-gradient">
              <Link href="/contact">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Support
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="tel:+919876543210">
                <Phone className="mr-2 h-5 w-5" />
                Call Us
              </a>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Phone: +91 92880 72525</p>
            <p>Email: reach@robosemi.in</p>
            <p>Available 24/7 for your convenience</p>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Additional Resources</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6 text-center space-y-4">
              <FileText className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive guides and technical documentation for all products
              </p>
              <Button variant="outline" size="sm">View Docs</Button>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 text-center space-y-4">
              <MessageSquare className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Community Forum</h3>
              <p className="text-sm text-muted-foreground">
                Connect with other users and get help from the community
              </p>
              <Button variant="outline" size="sm">Join Forum</Button>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 text-center space-y-4">
              <FileText className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step video guides for installation and setup
              </p>
              <Button variant="outline" size="sm">Watch Videos</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}