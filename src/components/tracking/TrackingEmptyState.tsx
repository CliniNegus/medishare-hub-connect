import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonitorSpeaker, Plus } from "lucide-react";

const TrackingEmptyState: React.FC = () => {
  return (
    <Card className="mt-8">
      <CardContent className="p-16 text-center">
        <div className="space-y-6">
          <div className="text-muted-foreground">
            <MonitorSpeaker className="h-20 w-20 mx-auto" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-foreground">No Equipment Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You don't have any equipment registered for tracking yet. Add your first device to start monitoring its performance and usage.
            </p>
          </div>
          
          <div className="flex justify-center gap-3">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
            <Button variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingEmptyState;