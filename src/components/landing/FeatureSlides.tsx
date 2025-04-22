
import React, { useState } from 'react';
import {
  Hospital, 
  Factory, 
  TrendingUp, 
  Users,
  ChartBar,
  Wallet,
  Database,
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureSlide {
  title: string;
  description: string;
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
    imageSrc?: string; // Optional image source
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
        icon: <Database className="h-8 w-8 text-red-500" />,
        title: "Free Inventory Management",
        description: "Manage your equipment inventory with no additional costs"
      },
      {
        icon: <Wallet className="h-8 w-8 text-red-500" />,
        title: "Access to Financing",
        description: "Connect with investors for equipment financing"
      },
      {
        icon: <Activity className="h-8 w-8 text-red-500" />,
        title: "Therapy as a Service",
        description: "Access advanced equipment on a pay-per-use basis"
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
        icon: <Activity className="h-8 w-8 text-red-500" />,
        title: "Real-time Monitoring",
        description: "Track and monitor equipment using IoT technology"
      },
      {
        icon: <TrendingUp className="h-8 w-8 text-red-500" />,
        title: "Lease Management",
        description: "Manage equipment leasing with real-time updates"
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
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Function to handle custom image upload (placeholder for now)
  const handleImageUpload = (slideIndex: number, featureIndex: number) => {
    console.log(`Upload image for slide ${slideIndex}, feature ${featureIndex}`);
    // In a real implementation, this would trigger a file upload dialog
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 relative">
      <div className="w-full overflow-hidden rounded-xl">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{featureSlides[currentSlide].title}</h3>
          <p className="text-gray-600 mb-8">{featureSlides[currentSlide].description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureSlides[currentSlide].features.map((feature, featureIndex) => (
              <div 
                key={featureIndex} 
                className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="mb-4 relative">
                  {feature.imageSrc ? (
                    <div className="mb-4 relative">
                      <img 
                        src={feature.imageSrc} 
                        alt={feature.title} 
                        className="w-full h-40 object-cover rounded-md mb-2"
                      />
                      <button 
                        onClick={() => handleImageUpload(currentSlide, featureIndex)}
                        className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md"
                        title="Replace image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4 relative">
                      {feature.icon}
                      <button 
                        onClick={() => handleImageUpload(currentSlide, featureIndex)}
                        className="absolute top-0 right-0 bg-white p-1 rounded-full shadow-md"
                        title="Add image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Navigation Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevSlide}
          className="bg-white border-red-200 hover:bg-red-50 text-red-500"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <div className="flex items-center space-x-2">
          {featureSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                currentSlide === index 
                  ? "bg-red-500 w-4" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextSlide}
          className="bg-white border-red-200 hover:bg-red-50 text-red-500"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    </div>
  );
};

export default FeatureSlides;
