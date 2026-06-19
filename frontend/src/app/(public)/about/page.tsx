import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, Award, Globe, Shield, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About RoboSemi</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Premium automation and electronics components for professionals and innovators. 
          Transform your projects with cutting-edge IoT and robotics technology backed by 
          expert support and exceptional service.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To provide premium automation and electronics components that empower 
              professionals and innovators worldwide to transform their projects with 
              cutting-edge IoT and robotics technology.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To be the premier global platform for premium automation and electronics 
              components, driving innovation in IoT, robotics, and emerging technologies 
              across industries worldwide.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose RoboSemi?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-muted-foreground">
              Professional-grade components from leading manufacturers with rigorous quality assurance.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
            <p className="text-muted-foreground">
              Technical guidance from experienced engineers to help you succeed.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">
              Quick and reliable shipping to get your projects moving forward.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Competitive Pricing</h3>
            <p className="text-muted-foreground">
              Best value for money with transparent pricing and no hidden costs.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
            <p className="text-muted-foreground">
              Serving customers worldwide with localized support and services.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
            <p className="text-muted-foreground">
              Safe and secure transactions with multiple payment options.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8 mb-16">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">100+</div>
            <div className="text-muted-foreground">Countries Served</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">5+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Our Story</h2>
        <div className="space-y-6 text-muted-foreground">
          <p>
            Founded in 2019 by a team of passionate engineers and entrepreneurs, RoboSemi 
            began with a vision to provide premium automation and electronics components 
            for the next generation of IoT and robotics innovations.
          </p>
          <p>
            What started as a specialized supplier has evolved into a global platform 
            serving professionals, engineers, and innovators across 100+ countries. 
            Our commitment to premium quality, cutting-edge technology, and expert support 
            has been the cornerstone of our success.
          </p>
          <p>
            Today, we're proud to offer over 10,000 premium components from leading 
            manufacturers, backed by expert technical support and a community of 
            professionals who drive innovation every day.
          </p>
        </div>
      </div>
    </div>
  );
}