import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptimizedImage from '@/components/OptimizedImage';
import { cn } from "@/lib/utils";
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

const dashboardShowcases: ShowcaseItem[] = [
  {
    title: "Hospital Dashboard",
    description: "Manage inventory, track equipment usage, and handle equipment requests all in one place.",
    imageSrc: "https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/landingpage/hospital-dashboard.jpg",
    alt: "Hospital Dashboard Interface"
  },
  {
    title: "Manufacturer Dashboard",
    description: "Monitor equipment distribution, manage virtual shops, and track real-time usage metrics.",
    imageSrc: "https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/landingpage/manufacturer-dashboard.jpg",
    alt: "Manufacturer Dashboard Interface"
  },
  {
    title: "Investor Dashboard",
    description: "Track investments, monitor ROI, and discover new opportunities in the medical equipment space.",
    imageSrc: "https://bqgipoqlxizdpryguzac.supabase.co/storage/v1/object/public/landingpage/investor-dashboard.jpg",
    alt: "Investor Dashboard Interface"
  }
];

const DashboardShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Update the current index when the carousel slides change
  useCallback(() => {
    if (!carouselApi) return;
    
    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };
    
    carouselApi.on("select", onSelect);
    
    // Cleanup function
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {dashboardShowcases.map((item, index) => (
            <CarouselItem key={index} className="pl-0 md:pl-4">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-3/5">
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-[16/9]">
                      <OptimizedImage 
                        src={item.imageSrc}
                        alt={item.alt}
                        height={400}
                        className="w-full h-full object-cover"
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
          <CarouselPrevious className="static transform-none" />
          <div className="flex items-center space-x-2">
            {dashboardShowcases.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  carouselApi?.scrollTo(index);
                  setCurrentIndex(index);
                }}
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
          <CarouselNext className="static transform-none" />
        </div>
      </Carousel>
    </div>
  );
};

export default DashboardShowcase;
