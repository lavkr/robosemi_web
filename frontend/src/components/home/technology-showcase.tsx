import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  Wifi, 
  Smartphone, 
  Cloud, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const technologies = [
  {
    icon: Cpu,
    title: 'AI & Machine Learning',
    description: 'Advanced AI-powered components for intelligent automation',
    features: ['Neural Processing', 'Edge Computing', 'Real-time Analytics'],
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Wifi,
    title: 'IoT Connectivity',
    description: 'Seamless connectivity solutions for the Internet of Things',
    features: ['5G Ready', 'Low Power', 'Global Coverage'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Cloud,
    title: 'Cloud Integration',
    description: 'Cloud-native solutions for scalable automation',
    features: ['Real-time Sync', 'Auto Scaling', 'Global CDN'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Enterprise-grade security for critical applications',
    features: ['End-to-End Encryption', 'Zero Trust', 'Compliance Ready'],
    color: 'from-red-500 to-orange-500'
  }
];

const certifications = [
  'ISO 9001:2015',
  'CE Certified',
  'FCC Approved',
  'RoHS Compliant',
  'UL Listed',
  'Energy Star'
];

export function TechnologyShowcase() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/3 to-purple-400/3 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div className="container-responsive relative">
        {/* Enhanced Header */}
        <div className="text-center space-y-8 mb-20 lg:mb-24">
          <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-8 py-3 rounded-full font-semibold text-sm lg:text-base">
            Technology Leadership
          </Badge>
          <h2 className="heading-lg text-balance">
            Powered by <span className="text-gradient-premium">Next-Gen Technology</span>
          </h2>
          <p className="text-responsive text-gray-600 max-w-4xl mx-auto text-balance leading-relaxed">
            Experience the future of automation with our cutting-edge technology stack, 
            designed to deliver unparalleled performance, security, and scalability for modern industries.
          </p>
        </div>

        {/* Enhanced Technology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 lg:mb-24">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <Card key={index} className="card-premium group relative overflow-hidden hover-lift fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Enhanced Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <CardContent className="relative p-8 lg:p-10 space-y-6">
                  {/* Enhanced Icon */}
                  <div className={`inline-flex p-5 lg:p-6 rounded-3xl bg-gradient-to-br ${tech.color} shadow-xl group-hover:shadow-2xl transition-all duration-500 hover-glow`}>
                    <Icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="space-y-5">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {tech.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-responsive-sm">
                      {tech.description}
                    </p>
                    
                    {/* Enhanced Features */}
                    <div className="space-y-3">
                      {tech.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm lg:text-base">
                          <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}