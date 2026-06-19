'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    role: 'Senior Automation Engineer',
    company: 'TechCorp Industries',
    content: 'RoboSemi has been our go-to partner for automation components for over 3 years. Their quality is unmatched, and their technical support team is incredibly knowledgeable. They helped us reduce our production downtime by 40%.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    project: 'Industrial Automation System'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'IoT Solutions Architect',
    company: 'Smart City Solutions',
    content: 'The range of IoT sensors and controllers from RoboSemi is impressive. We\'ve deployed over 10,000 devices across multiple smart city projects. The reliability and performance have exceeded our expectations.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 5,
    project: 'Smart City Infrastructure'
  },
  {
    id: '3',
    name: 'Prof. Amit Patel',
    role: 'Robotics Professor',
    company: 'IIT Mumbai',
    content: 'As an educator, I appreciate RoboSemi\'s commitment to supporting academic institutions. Their educational discounts and comprehensive documentation make it easy for students to learn and innovate.',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    rating: 5,
    project: 'Educational Robotics Program'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    role: 'Startup Founder',
    company: 'AgriTech Innovations',
    content: 'Starting our agritech company, we needed reliable components at competitive prices. RoboSemi not only provided excellent products but also valuable technical guidance that helped us bring our product to market faster.',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
    rating: 5,
    project: 'Smart Agriculture Solution'
  },
  {
    id: '5',
    name: 'Michael Chen',
    role: 'R&D Director',
    company: 'AutoMotive Systems',
    content: 'The automotive-grade components from RoboSemi have been crucial for our autonomous vehicle research. Their quality standards and testing procedures align perfectly with our stringent requirements.',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    rating: 5,
    project: 'Autonomous Vehicle Development'
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl floating-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container-responsive relative">
        {/* Enhanced Header */}
        <div className="text-center space-y-8 mb-20 lg:mb-24">
          <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-0 px-8 py-3 rounded-full font-semibold text-sm lg:text-base">
            Customer Success Stories
          </Badge>
          <h2 className="heading-lg text-gray-800 text-balance">
            Trusted by <span className="text-gradient-premium">Industry Leaders</span>
          </h2>
          <p className="text-responsive text-gray-600 max-w-4xl mx-auto text-balance leading-relaxed">
            Discover how leading companies and institutions worldwide are achieving 
            breakthrough results with our premium automation and electronics solutions.
          </p>
        </div>

        {/* Enhanced Main Testimonial */}
        <div className="max-w-5xl mx-auto">
          <Card className="card-premium relative overflow-hidden shadow-2xl">
            <CardContent className="p-12 lg:p-16">
              {/* Enhanced Quote Icon */}
              <div className="flex justify-center mb-10">
                <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl hover-glow">
                  <Quote className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Enhanced Testimonial Content */}
              <div className="text-center space-y-10">
                {/* Enhanced Rating */}
                <div className="flex justify-center space-x-2">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-7 w-7 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Enhanced Content */}
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-800 leading-relaxed text-balance max-w-4xl mx-auto">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Enhanced Author */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-xl">
                    <Image
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-800">{currentTestimonial.name}</div>
                    <div className="text-lg text-gray-600">{currentTestimonial.role}</div>
                    <div className="text-blue-600 font-semibold text-lg">{currentTestimonial.company}</div>
                    <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full inline-block">Project: {currentTestimonial.project}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="w-12 h-12 lg:w-14 lg:h-14 bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-2xl shadow-lg hover-lift"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Enhanced Dots */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`rounded-full transition-all duration-300 hover-lift ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-4'
                      : 'bg-gray-300 w-4 h-4 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="w-12 h-12 lg:w-14 lg:h-14 bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-2xl shadow-lg hover-lift"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Enhanced Bottom Stats */}
        <div className="mt-24 lg:mt-32">
          <div className="glass-card p-10 lg:p-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800">
              Customer Success Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {[
                { value: '50K+', label: 'Satisfied Customers' },
                { value: '99.5%', label: 'Customer Satisfaction' },
                { value: '24/7', label: 'Expert Support' },
                { value: '15+', label: 'Years Experience' }
              ].map((stat, index) => (
                <div key={index} className="text-center space-y-3 fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-4xl lg:text-5xl font-bold text-gradient-premium">{stat.value}</div>
                  <div className="text-gray-600 font-medium text-responsive-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}