import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, Radio, Move, Cpu, Wrench, ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'automation',
    name: 'Automation',
    icon: Settings,
    description: 'Smart automation solutions for modern industries',
    productCount: '2,500+',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Zap,
    description: 'High-quality electronic components and modules',
    productCount: '3,200+',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50'
  },
  {
    id: 'sensors',
    name: 'Sensors',
    icon: Radio,
    description: 'Precision sensors for accurate measurements',
    productCount: '1,800+',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50'
  },
  {
    id: 'actuators',
    name: 'Actuators',
    icon: Move,
    description: 'Powerful actuators for motion control',
    productCount: '950+',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'from-purple-50 to-violet-50'
  },
  {
    id: 'controllers',
    name: 'Controllers',
    icon: Cpu,
    description: 'Advanced microcontrollers and development boards',
    productCount: '1,200+',
    color: 'from-red-500 to-pink-500',
    bgColor: 'from-red-50 to-pink-50'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: Wrench,
    description: 'Essential tools and accessories for projects',
    productCount: '2,100+',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'from-indigo-50 to-blue-50'
  },
];

export function CategoriesSection() {
  return (
    <section className="relative z-10">
      <div className="container-responsive">
        <div className="text-center space-y-8 mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-blue-700 font-semibold text-sm">Product Categories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
            Explore Our
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Premium Range
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From cutting-edge automation solutions to precision sensors, discover everything you need 
            to bring your innovative projects to life.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <div className="group relative">
                  {/* Modern Card with Glassmorphism */}
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                  
                  <div className="relative p-6 lg:p-8 text-center space-y-6">
                    {/* Modern Icon Design */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                        <div className={`relative p-4 lg:p-5 bg-gradient-to-br ${category.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                      <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-xs font-medium text-gray-700">{category.productCount}</span>
                      </div>
                    </div>
                    
                    {/* Modern Hover Effect */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        <span>Explore</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}