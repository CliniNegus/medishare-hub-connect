
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Calendar, 
  Plus,
  StethoscopeIcon
} from "lucide-react";

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <TabsList>
        <TabsTrigger 
          value="equipment" 
          className="text-sm"
          onClick={() => setActiveTab('equipment')}
          data-state={activeTab === 'equipment' ? 'active' : ''}
        >
          <StethoscopeIcon className="h-4 w-4 mr-2" />
          Equipment
        </TabsTrigger>
        <TabsTrigger 
          value="bookings" 
          className="text-sm"
          onClick={() => setActiveTab('bookings')}
          data-state={activeTab === 'bookings' ? 'active' : ''}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Bookings
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="text-sm"
          onClick={() => setActiveTab('analytics')}
          data-state={activeTab === 'analytics' ? 'active' : ''}
        >
          <BarChart className="h-4 w-4 mr-2" />
          Analytics
        </TabsTrigger>
      </TabsList>
      
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add Equipment
      </Button>
    </div>
  );
};

export default DashboardHeader;
