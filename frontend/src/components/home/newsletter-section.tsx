'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Gift, Bell, TrendingUp, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const benefits = [
  {
    icon: Gift,
    title: 'Exclusive Deals',
    description: 'Get early access to sales and special discounts'
  },
  {
    icon: Bell,
    title: 'New Product Alerts',
    description: 'Be the first to know about latest innovations'
  },
  {
    icon: TrendingUp,
    title: 'Industry Insights',
    description: 'Weekly updates on automation trends and tech news'
  }
];

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Successfully subscribed! Welcome to RoboSemi community.');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div className="container-responsive relative">
        <Card className="max-w-5xl mx-auto card-premium relative overflow-hidden shadow-2xl">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
          </div>

          <CardContent className="relative p-12 lg:p-20 text-center space-y-10">
            {/* Enhanced Header */}
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-teal-100 to-green-100 text-teal-700 border-0 px-8 py-3 rounded-full font-semibold text-sm lg:text-base">
                Stay Connected
              </Badge>
              <h2 className="heading-lg text-balance text-gray-800">
                Join the <span className="text-gradient-premium">RoboSemi Community</span>
              </h2>
              <p className="text-responsive text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
                Get exclusive access to new products, special offers, and expert insights 
                delivered straight to your inbox every week. Join 25,000+ professionals already subscribed.
              </p>
            </div>

            {/* Enhanced Benefits */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 my-16">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex flex-col items-center space-y-5 fade-in-up hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="p-5 lg:p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-lg hover-glow">
                      <Icon className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{benefit.title}</h3>
                    <p className="text-responsive-sm text-gray-600 text-center leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Newsletter Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="btn-gradient-premium px-10 py-4 h-14 text-lg rounded-2xl hover-lift"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      Subscribe Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Enhanced Privacy Note */}
            <p className="text-sm text-gray-500">
              We respect your privacy. Unsubscribe at any time. 
              <a href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline ml-1 font-medium">
                Privacy Policy
              </a>
            </p>

            {/* Enhanced Social Proof */}
            <div className="pt-10 border-t border-gray-200">
              <div className="glass-card p-8 lg:p-10">
                <p className="text-lg font-semibold text-gray-700 mb-6">
                  Trusted by Industry Leaders
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {[
                    { name: 'TechCorp', count: '5K+' },
                    { name: 'IIT Mumbai', count: '2K+' },
                    { name: 'Smart Cities', count: '8K+' },
                    { name: 'AutoMotive', count: '3K+' }
                  ].map((company, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-2xl font-bold text-blue-600">{company.count}</div>
                      <div className="text-sm font-medium text-gray-600">{company.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}