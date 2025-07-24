import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings } from "lucide-react";

interface TrackingPageHeaderProps {
  onRefresh: () => void;
}

const TrackingPageHeader: React.FC<TrackingPageHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Equipment Tracking
        </h1>
        <p className="text-muted-foreground">
          Monitor your equipment performance and usage in real-time
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm" 
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default TrackingPageHeader;