import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Users, 
  Headphones, 
  Truck, 
  Shield, 
  Clock,
  Globe,
  ThumbsUp
} from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every component undergoes rigorous testing to ensure the highest quality standards',
    color: 'text-yellow-600',
    bgColor: 'from-yellow-50 to-orange-50'
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our engineers and specialists provide world-class technical support and guidance',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-cyan-50'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to help you with any technical challenges',
    color: 'text-green-600',
    bgColor: 'from-green-50 to-emerald-50'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Express shipping options with real-time tracking for urgent project needs',
    color: 'text-purple-600',
    bgColor: 'from-purple-50 to-violet-50'
  },
  {
    icon: Shield,
    title: 'Warranty Protection',
    description: 'Comprehensive warranty coverage with hassle-free replacement policies',
    color: 'text-red-600',
    bgColor: 'from-red-50 to-pink-50'
  },
  {
    icon: Clock,
    title: 'Quick Response',
    description: 'Fast turnaround times for quotes, orders, and technical inquiries',
    color: 'text-indigo-600',
    bgColor: 'from-indigo-50 to-blue-50'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Worldwide shipping with local support teams in major markets',
    color: 'text-teal-600',
    bgColor: 'from-teal-50 to-cyan-50'
  },
  {
    icon: ThumbsUp,
    title: 'Proven Results',
    description: 'Trusted by 50,000+ customers with 99.5% satisfaction rating',
    color: 'text-orange-600',
    bgColor: 'from-orange-50 to-yellow-50'
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-400/3 to-purple-400/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-green-400/3 to-blue-400/3 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-yellow-400/3 rounded-full blur-xl" />
      </div>
      
      <div className="container-responsive relative">
        {/* Enhanced Header */}
        <div className="text-center space-y-8 mb-20 lg:mb-24">
          <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-0 px-8 py-3 rounded-full font-semibold text-sm lg:text-base">
            Why Choose RoboSemi
          </Badge>
          <h2 className="heading-lg text-balance">
            Your <span className="text-gradient-premium">Trusted Partner</span> in Innovation
          </h2>
          <p className="text-responsive text-gray-600 max-w-4xl mx-auto text-balance leading-relaxed">
            We're more than just a supplier – we're your innovation partner, committed to 
            providing exceptional products, services, and support for your success in the digital age.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 lg:mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="card-interactive group relative overflow-hidden fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Enhanced Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-80 transition-opacity duration-500`} />
                
                <CardContent className="relative p-8 lg:p-10 text-center space-y-6">
                  {/* Enhanced Icon */}
                  <div className="flex justify-center">
                    <div className="p-5 lg:p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 border border-gray-100">
                      <Icon className={`h-8 w-8 lg:h-10 lg:w-10 ${feature.color}`} />
                    </div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-white/90 leading-relaxed text-responsive-sm transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Bottom Stats */}
        <div className="glass-card p-10 lg:p-16">
          <h3 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800">
            Trusted by Industry Leaders
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '1M+', label: 'Orders Delivered' },
              { value: '99.5%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-3 fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl lg:text-5xl font-bold text-gradient-premium">{stat.value}</div>
                <div className="text-gray-600 font-medium text-responsive-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}