
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ShowcaseItem {
  title: string;
  description: string;
  imageSrc: string;
  alt: string;
}

const AUTOPLAY_INTERVAL = 6000;
const RESUME_DELAY = 8000;

const DashboardShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lastInteraction, setLastInteraction] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Fetch showcase data from Supabase
  useEffect(() => {
    const fetchShowcaseData = async () => {
      try {
        setLoading(true);
        console.log('Fetching platform showcase data...');
        
        const { data, error } = await supabase
          .from('platform_showcases')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching showcase data:', error);
          return;
        }

        console.log('Fetched showcase data:', data);

        const formattedData: ShowcaseItem[] = data.map(item => ({
          title: item.title,
          description: item.description,
          imageSrc: item.image_url,
          alt: item.alt_text
        }));

        console.log('Formatted showcase data:', formattedData);
        setShowcaseItems(formattedData);
      } catch (error) {
        console.error('Error fetching showcase data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcaseData();
  }, []);

  // Update the current index when the carousel slides change
  useEffect(() => {
    if (!carouselApi) return;
    
    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };
    
    carouselApi.on("select", onSelect);
    
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Autoplay logic with resume delay after manual navigation
  useEffect(() => {
    if (!carouselApi || !isAutoPlaying || prefersReducedMotion || showcaseItems.length === 0) return;
    
    const now = Date.now();
    const timeSinceInteraction = now - lastInteraction;
    
    // If user recently interacted, wait for resume delay
    if (lastInteraction > 0 && timeSinceInteraction < RESUME_DELAY) {
      const timeout = setTimeout(() => {
        setLastInteraction(0); // Reset to allow autoplay
      }, RESUME_DELAY - timeSinceInteraction);
      return () => clearTimeout(timeout);
    }
    
    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, AUTOPLAY_INTERVAL);
    
    return () => clearInterval(interval);
  }, [carouselApi, isAutoPlaying, lastInteraction, prefersReducedMotion, showcaseItems.length]);

  // Handle manual dot click with interaction tracking
  const handleDotClick = (index: number) => {
    setLastInteraction(Date.now());
    carouselApi?.scrollTo(index);
    setCurrentIndex(index);
  };

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Show loading state or empty state
  if (loading || showcaseItems.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-3/5">
              <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-[16/9] animate-pulse">
              </div>
            </div>
            <div className="md:w-2/5 flex flex-col justify-center">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-6xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {showcaseItems.map((item, index) => (
            <CarouselItem key={index} className="pl-0 md:pl-4">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-3/5">
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-[16/9]">
                      <img 
                        src={item.imageSrc}
                        alt={item.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onLoad={() => {
                          console.log('Image loaded successfully:', item.imageSrc);
                        }}
                        onError={(e) => {
                          console.error('Image failed to load:', item.imageSrc);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div className="md:w-2/5 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-[#333333] mb-3">{item.title}</h3>
                    <p className="text-[#333333]">{item.description}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex items-center justify-center mt-4 gap-3">
          <CarouselPrevious 
            className="static transform-none" 
            onClick={() => setLastInteraction(Date.now())}
          />
          <div className="flex items-center space-x-2">
            {showcaseItems.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  currentIndex === index 
                    ? "bg-[#E02020] w-4" 
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <CarouselNext 
            className="static transform-none" 
            onClick={() => setLastInteraction(Date.now())}
          />
        </div>
      </Carousel>
    </div>
  );
};

export default DashboardShowcase;
