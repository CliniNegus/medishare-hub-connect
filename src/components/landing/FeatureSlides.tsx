
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  Hospital, 
  Factory, 
  TrendingUp, 
  Users,
  ChartBar,
  ChartLine
} from "lucide-react";

interface FeatureSlide {
  title: string;
  description: string;
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

const featureSlides: FeatureSlide[] = [
  {
    title: "For Hospitals",
    description: "Streamline your medical equipment management",
    features: [
      {
        icon: <Hospital className="h-8 w-8 text-red-500" />,
        title: "Equipment Sharing",
        description: "Share equipment within hospital clusters"
      },
      {
        icon: <ChartBar className="h-8 w-8 text-red-500" />,
        title: "Usage Analytics",
        description: "Track equipment utilization and efficiency"
      },
      {
        icon: <Users className="h-8 w-8 text-red-500" />,
        title: "Staff Management",
        description: "Coordinate staff access and training"
      }
    ]
  },
  {
    title: "For Manufacturers",
    description: "Expand your market reach and improve distribution",
    features: [
      {
        icon: <Factory className="h-8 w-8 text-red-500" />,
        title: "Direct Distribution",
        description: "Connect directly with healthcare providers"
      },
      {
        icon: <ChartLine className="h-8 w-8 text-red-500" />,
        title: "Market Analytics",
        description: "Access real-time market demand data"
      },
      {
        icon: <TrendingUp className="h-8 w-8 text-red-500" />,
        title: "Performance Tracking",
        description: "Monitor equipment performance metrics"
      }
    ]
  },
  {
    title: "For Investors",
    description: "Make informed healthcare investment decisions",
    features: [
      {
        icon: <TrendingUp className="h-8 w-8 text-red-500" />,
        title: "ROI Analytics",
        description: "Track investment performance in real-time"
      },
      {
        icon: <Hospital className="h-8 w-8 text-red-500" />,
        title: "Portfolio Management",
        description: "Manage healthcare equipment investments"
      },
      {
        icon: <Users className="h-8 w-8 text-red-500" />,
        title: "Network Access",
        description: "Connect with healthcare providers"
      }
    ]
  }
];

const FeatureSlides: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Carousel className="relative">
        <CarouselContent>
          {featureSlides.map((slide, index) => (
            <CarouselItem key={index} className="md:basis-full">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{slide.title}</h3>
                <p className="text-gray-600 mb-8">{slide.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {slide.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="mb-4">{feature.icon}</div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 bg-white" />
        <CarouselNext className="absolute right-0 bg-white" />
      </Carousel>
    </div>
  );
};

export default FeatureSlides;
