import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Users, Package, Award, Globe, Clock, Shield, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Package,
    value: '10,000+',
    label: 'Premium Products',
    description: 'Curated components in stock',
    color: 'text-blue-600'
  },
  {
    icon: Users,
    value: '50,000+',
    label: 'Global Customers',
    description: 'Trust our platform worldwide',
    color: 'text-green-600'
  },
  {
    icon: ShoppingCart,
    value: '1M+',
    label: 'Orders Delivered',
    description: 'Successfully completed',
    color: 'text-purple-600'
  },
  {
    icon: Award,
    value: '99.5%',
    label: 'Satisfaction Rate',
    description: 'Customer happiness score',
    color: 'text-yellow-600'
  },
  {
    icon: Globe,
    value: '150+',
    label: 'Countries Served',
    description: 'Global shipping coverage',
    color: 'text-indigo-600'
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Expert Support',
    description: 'Round-the-clock assistance',
    color: 'text-red-600'
  },
  {
    icon: Shield,
    value: '15+',
    label: 'Years Experience',
    description: 'Industry expertise',
    color: 'text-teal-600'
  },
  {
    icon: TrendingUp,
    value: '40%',
    label: 'YoY Growth',
    description: 'Consistent expansion',
    color: 'text-orange-600'
  },
];

export function StatsSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl floating-animation" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl floating-animation" style={{ animationDelay: '1s' }} />
        <div className="absolute top-20 right-1/4 w-36 h-36 bg-blue-400/5 rounded-full blur-2xl floating-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-purple-400/5 rounded-full blur-xl floating-animation" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container-responsive relative">
        <div className="text-center space-y-8 mb-20 lg:mb-24">
          <h2 className="heading-lg text-white text-balance">
            Trusted by <span className="text-yellow-400">Professionals Worldwide</span>
          </h2>
          <p className="text-responsive text-white/90 max-w-4xl mx-auto text-balance leading-relaxed">
            Join thousands of engineers, makers, and innovators who rely on RoboSemi 
            for their automation and electronics needs. Our numbers speak for themselves.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-effect border-white/20 backdrop-blur-lg hover-lift fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 lg:p-8 text-center text-white space-y-5">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm hover-glow">
                      <Icon className="h-8 w-8 lg:h-10 lg:w-10 text-yellow-400" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-lg lg:text-xl text-white">
                      {stat.label}
                    </div>
                    <div className="text-sm lg:text-base text-white/80 leading-relaxed">
                      {stat.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Bottom Achievement Section */}
        <div className="mt-24 lg:mt-32 text-center space-y-10">
          <h3 className="text-3xl lg:text-4xl font-bold text-white">
            Recognized Excellence in Innovation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {[
              'ISO 9001:2015 Certified',
              'Industry Leader 2024',
              'Best Customer Service',
              'Innovation Award Winner'
            ].map((achievement, index) => (
              <div key={index} className="glass-effect px-6 py-4 rounded-2xl hover-lift fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <span className="text-white font-semibold text-sm lg:text-base">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}