'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Settings
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    console.log('Newsletter subscription:', email);
    setEmail('');
  };
  const handleSocialClick = (platform: string) => {
    const socialUrls = {
      facebook: 'https://www.facebook.com/robosemi.in',
      twitter: 'https://twitter.com/robosemi',
      instagram: 'https://www.instagram.com/robosemi_tech',
      linkedin: 'https://www.linkedin.com/company/robosemitech'
    };

    const url = socialUrls[platform as keyof typeof socialUrls];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">RoboSemi</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium automation and electronics components for professionals and innovators. 
              Transform your projects with cutting-edge IoT and robotics technology.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" onClick={() => handleSocialClick('facebook')}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleSocialClick('twitter')}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleSocialClick('instagram')}>
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleSocialClick('linkedin')}>
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/products" className="block text-sm text-muted-foreground hover:text-primary">
                All Products
              </Link>
              <Link href="/new-arrivals" className="block text-sm text-muted-foreground hover:text-primary">
                New Arrivals
              </Link>
              <Link href="/best-sellers" className="block text-sm text-muted-foreground hover:text-primary">
                Best Sellers
              </Link>
              <Link href="/deals" className="block text-sm text-muted-foreground hover:text-primary">
                Deals & Offers
              </Link>
              <Link href="/projects" className="block text-sm text-muted-foreground hover:text-primary">
                Projects
              </Link>
              <Link href="/training" className="block text-sm text-muted-foreground hover:text-primary">
                Training
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <div className="space-y-2">
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary">
                Contact Us
              </Link>
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary">
                Help Center
              </Link>
              <Link href="/track-order" className="block text-sm text-muted-foreground hover:text-primary">
                Track Order
              </Link>
              <Link href="/returns-policy" className="block text-sm text-muted-foreground hover:text-primary">
                Returns Policy
              </Link>
              <Link href="/shipping-policy" className="block text-sm text-muted-foreground hover:text-primary">
                Shipping Info
              </Link>
              <Link href="/warranty-policy" className="block text-sm text-muted-foreground hover:text-primary">
                Warranty
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 92880 72525</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>reach@robosemi.in</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>
                    Kasba Purnia <br />
                    Purnia Bihar <br />
                    India 854303
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Newsletter */}
        <div className="text-center mb-8">
          <h3 className="font-semibold mb-2">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter for the latest products and offers
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto space-x-2">
            <Input 
              placeholder="Enter your email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 RoboSemi. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}