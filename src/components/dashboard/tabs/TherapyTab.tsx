
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Calendar, DollarSign, Activity, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TherapyTab: React.FC = () => {
  // Mock therapy equipment data
  const therapyEquipment = [
    {
      id: 1,
      name: "Advanced Radiation Therapy System",
      description: "State-of-the-art radiation therapy system with precise targeting capabilities",
      pricePerUse: 1200,
      availability: "High",
      category: "Oncology"
    },
    {
      id: 2,
      name: "Hyperbaric Oxygen Chamber",
      description: "Treatment chamber for delivering high-pressure oxygen therapy for wound healing",
      pricePerUse: 850,
      availability: "Medium",
      category: "Wound Care"
    },
    {
      id: 3,
      name: "Robotic Rehabilitation System",
      description: "Advanced robotics for physical therapy and rehabilitation of patients",
      pricePerUse: 750,
      availability: "High",
      category: "Rehabilitation"
    },
    {
      id: 4,
      name: "Advanced Dialysis System",
      description: "High-efficiency dialysis system with real-time monitoring",
      pricePerUse: 980,
      availability: "Limited",
      category: "Nephrology"
    },
    {
      id: 5,
      name: "Laser Therapy System",
      description: "Precision laser system for various therapeutic applications",
      pricePerUse: 600,
      availability: "High",
      category: "Dermatology"
    },
    {
      id: 6,
      name: "Cardiac Monitoring System",
      description: "Advanced system for continuous cardiac monitoring and therapy",
      pricePerUse: 890,
      availability: "Medium",
      category: "Cardiology"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-red-600">Therapy as a Service</h2>
          <p className="text-gray-600">Access advanced therapy equipment without capital investment</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Therapy
        </Button>
      </div>
      
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center">
            <HeartPulse className="h-5 w-5 mr-2" />
            Therapy Equipment Subscription
          </CardTitle>
          <CardDescription className="text-red-700">
            Subscribe to our therapy equipment service and only pay for what you use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-red-100">
              <h3 className="font-semibold text-red-600 mb-2">Basic Plan</h3>
              <p className="text-sm text-gray-600 mb-4">Access to standard therapy equipment</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Starting at</span>
                <span className="text-lg font-bold text-red-600">$500/use</span>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700">Select Plan</Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border-2 border-red-600">
              <div className="absolute -mt-8 ml-1">
                <Badge className="bg-red-600">Most Popular</Badge>
              </div>
              <h3 className="font-semibold text-red-600 mb-2">Premium Plan</h3>
              <p className="text-sm text-gray-600 mb-4">Access to advanced therapy equipment</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Starting at</span>
                <span className="text-lg font-bold text-red-600">$800/use</span>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700">Select Plan</Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-red-100">
              <h3 className="font-semibold text-red-600 mb-2">Enterprise Plan</h3>
              <p className="text-sm text-gray-600 mb-4">Unlimited access to all therapy equipment</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Custom pricing</span>
                <span className="text-lg font-bold text-red-600">Contact Us</span>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700">Get Quote</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {therapyEquipment.map(equipment => (
          <Card key={equipment.id} className="overflow-hidden">
            <div className="h-3 bg-red-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{equipment.name}</CardTitle>
              <CardDescription className="text-xs">
                {equipment.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{equipment.description}</p>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-600">Availability: </span>
                  <span className={`ml-1 text-sm ${
                    equipment.availability === 'High' ? 'text-green-600' : 
                    equipment.availability === 'Medium' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {equipment.availability}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-red-600" />
                  <span className="font-semibold text-red-600">${equipment.pricePerUse}/use</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Calendar className="h-4 w-4 mr-1" />
                  Book Now
                </Button>
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  <FileText className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Therapy Equipment Usage Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
              <h3 className="font-medium text-red-800 mb-2">Cost Efficiency</h3>
              <p className="text-sm text-gray-600">Pay only for actual usage without large capital investments in equipment</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
              <h3 className="font-medium text-red-800 mb-2">Latest Technology</h3>
              <p className="text-sm text-gray-600">Always access the most advanced and updated therapy equipment</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
              <h3 className="font-medium text-red-800 mb-2">Maintenance Included</h3>
              <p className="text-sm text-gray-600">All maintenance and servicing is handled by our expert technicians</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapyTab;
