
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, Activity } from "lucide-react";
import useDeviceLeasing from '@/hooks/useDeviceLeasing';

interface BlockchainDeviceUsageProps {
  equipmentId: number;
  pricePerUse: number;
  usageData: {
    powerCycles: number;
  };
}

const BlockchainDeviceUsage: React.FC<BlockchainDeviceUsageProps> = ({ 
  equipmentId, 
  pricePerUse, 
  usageData 
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isConnected, connectWallet, investInDevice, viewEarnings, error } = useDeviceLeasing();
  const { toast } = useToast();
  const [investment, setInvestment] = useState<string>("0.05");

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err: any) {
      toast({
        title: "Connection Error",
        description: err.message || "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  const handleInvestment = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await investInDevice(equipmentId, investment);
      toast({
        title: "Investment Successful",
        description: `You successfully invested ${investment} MATIC in device #${equipmentId}`,
        variant: "default"
      });
    } catch (err: any) {
      toast({
        title: "Investment Failed",
        description: err.message || "Failed to complete investment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkEarnings = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const earnings = await viewEarnings(equipmentId);
      toast({
        title: "Device Earnings",
        description: `Your earnings for device #${equipmentId}: ${earnings} MATIC`,
        variant: "default"
      });
    } catch (err: any) {
      toast({
        title: "Error Checking Earnings",
        description: err.message || "Failed to retrieve earnings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-red-600" /> 
            Blockchain Integration
          </CardTitle>
          {isConnected ? (
            <Badge className="bg-green-500">Connected</Badge>
          ) : (
            <Badge className="bg-amber-500">Not Connected</Badge>
          )}
        </div>
        <CardDescription>
          Invest in this device or check your earnings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <h4 className="text-sm font-medium mb-2">Device Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Device ID:</span>
                <span className="ml-2 font-medium">#{equipmentId}</span>
              </div>
              <div>
                <span className="text-gray-500">Usage Count:</span>
                <span className="ml-2 font-medium">{usageData.powerCycles}</span>
              </div>
              <div>
                <span className="text-gray-500">Price Per Use:</span>
                <span className="ml-2 font-medium">{pricePerUse} MATIC</span>
              </div>
              <div>
                <span className="text-gray-500">Total Value:</span>
                <span className="ml-2 font-medium">{usageData.powerCycles * pricePerUse} MATIC</span>
              </div>
            </div>
          </div>

          {!isConnected ? (
            <Button 
              className="w-full bg-red-600 hover:bg-red-700" 
              onClick={handleConnectWallet}
              disabled={isLoading}
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  step="0.01"
                  min="0.01"
                />
                <span>MATIC</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700" 
                  onClick={handleInvestment}
                  disabled={isLoading}
                >
                  <Activity className="mr-1 h-4 w-4" />
                  Invest Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-red-600 text-red-600" 
                  onClick={checkEarnings}
                  disabled={isLoading}
                >
                  Check Earnings
                </Button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm mt-2">
              Error: {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainDeviceUsage;
