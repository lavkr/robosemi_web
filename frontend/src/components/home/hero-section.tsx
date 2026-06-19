"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Star,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface HeroSlide {
  id: string;
  desktoimage: string;
  mobileImage: string;
  link?: string;
  isActive: boolean;
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0 && isAutoPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [slides.length, isAutoPlaying]);

  const fetchHeroSlides = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/slides`);
      if (response.ok) {
        const data = await response.json();
        const slidesData = data.data || data.slides || [];
        if (slidesData.length > 0) {
          setSlides(slidesData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch hero slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleSlideClick = (slide: HeroSlide) => {
    window.location.href = '/products';
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <p className="text-white/70">Loading amazing content...</p>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative overflow-hidden w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="text-center text-white space-y-8">
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <Image
                src="/logo.jpeg"
                alt="RoboSemi Logo"
                width={80}
                height={80}
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-4xl font-bold text-white">RS</div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            RoboSemi
          </h1>
          <p className="text-xl text-white/70 mb-8">Premium Automation & Electronics Components</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={() => window.location.href = '/products'}
          >
            Explore Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Slider Container */}
      <div className="relative w-full h-full">
        {/* Slides Wrapper */}
        <div 
          className="flex h-full transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${slides.length * 100}%`
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative flex-shrink-0 w-full h-full"
              style={{ width: `${100 / slides.length}%` }}
            >
              {/* Background Image with Parallax Effect */}
              <div 
                className="absolute inset-0 transition-transform duration-1000 ease-out"
                style={{
                  transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)',
                }}
              >
                <picture>
                  <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
                  <Image
                    src={slide.desktoimage}
                    alt="RoboSemi Premium Components"
                    fill
                    className="object-cover"
                    priority={index <= 1}
                    sizes="100vw"
                  />
                </picture>
                
                {/* Dynamic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6 lg:px-12">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className={`space-y-8 transform transition-all duration-1200 ${
                      index === currentSlide 
                        ? 'translate-x-0 opacity-100 delay-300' 
                        : '-translate-x-16 opacity-0'
                    }`}>
                      <div className="space-y-6">
                        <Badge className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Premium Electronics
                        </Badge>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none">
                          <span className="block text-white mb-2">Robo</span>
                          <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Semi
                          </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-lg">
                          Cutting-edge automation components and robotics solutions for the future of innovation.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        {slide.link && (
                          <Button
                            size="lg"
                            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSlideClick(slide);
                            }}
                          >
                            Explore Collection
                            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        )}
                        
                        <Button
                          size="lg"
                          variant="outline"
                          className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:border-white/50 px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = '/about';
                          }}
                        >
                          <Play className="mr-3 h-5 w-5" />
                          Watch Demo
                        </Button>
                      </div>
                    </div>
                    
                    {/* Right Content - Stats */}
                    <div className={`hidden lg:block transform transition-all duration-1200 ${
                      index === currentSlide 
                        ? 'translate-x-0 opacity-100 delay-500' 
                        : 'translate-x-16 opacity-0'
                    }`}>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        {slides.length > 1 && (
          <>
            {/* Arrow Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-30 group"
            >
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 group-hover:scale-110">
                <ChevronLeft className="h-6 w-6 text-white" />
              </div>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-30 group"
            >
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 group-hover:scale-110">
                <ChevronRight className="h-6 w-6 text-white" />
              </div>
            </button>

            {/* Progress Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
              <div className="flex space-x-3 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`relative transition-all duration-500 rounded-full ${
                      index === currentSlide
                        ? "bg-white w-10 h-3 shadow-lg"
                        : "bg-white/40 w-3 h-3 hover:bg-white/60 hover:scale-125"
                    }`}
                    onClick={() => goToSlide(index)}
                  >
                    {index === currentSlide && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
