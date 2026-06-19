import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section';
import { TechnologyShowcase } from '@/components/home/technology-showcase';
import { PageTracker } from '@/components/analytics/page-tracker';

export const metadata = {
  title: 'RoboSemi - Premium Automation & Electronics Components',
  description: 'Discover premium IoT, robotics, and automation components. Professional-grade electronics for engineers, makers, and innovators worldwide.',
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <PageTracker page="home" />
      {/* Hero Section - Modern Gradient with Geometric Patterns */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <HeroSection />
      </section>

      {/* Main Content - Modern Card-Based Layout */}
      <main className="relative bg-gray-50">
        {/* Categories - Modern Grid with Glassmorphism */}
        <section className="relative py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/20" />
          <CategoriesSection />
        </section>

        {/* Featured Products - Premium Showcase */}
        <section className="relative py-20 lg:py-32 bg-white">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-green-100/50 to-blue-100/50 rounded-full blur-2xl" />
          </div>
          <FeaturedProducts />
        </section>


        {/* Technology Showcase - Innovation Focus */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40" />
          <TechnologyShowcase />
        </section>

        {/* Why Choose Us - Modern Feature Grid */}
        <section className="relative bg-white">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-100/30 to-blue-100/30 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-xl" />
          </div>
          <WhyChooseUsSection />
        </section>
      </main>

      
    </div>
  );
}