import { useState, useEffect } from 'react';

export interface IoTDevice {
  deviceId: string;
  equipmentId: string;
  equipmentName: string;
  status: 'online' | 'offline' | 'standby';
  lastActive: string;
  batteryLevel: number;
  signalStrength: number;
  location?: string;
  usageData: {
    hoursToday: number;
    totalHours: number;
    powerCycles: number;
  };
}

export interface UsageDataPoint {
  timestamp: string;
  powerUsage: number;
  temperature: number;
}

// This hook simulates IoT data for development purposes
// In a real application, this would connect to your IoT backend
export function useIoTData(equipmentId: string) {
  const [device, setDevice] = useState<IoTDevice | null>(null);
  const [usageData, setUsageData] = useState<UsageDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching device data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real application, this would be an API call to your IoT platform
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for development
        const mockDevice: IoTDevice = {
          deviceId: `IOT-${Math.floor(Math.random() * 1000)}`,
          equipmentId,
          equipmentName: equipmentId.includes('MRI') ? 'MRI Scanner XR-5000' : 
                         equipmentId.includes('VENT') ? 'Ventilator Pro 2025' : 
                         'Medical Equipment',
          status: Math.random() > 0.2 ? 'online' : (Math.random() > 0.5 ? 'standby' : 'offline'),
          lastActive: new Date().toISOString(),
          batteryLevel: Math.floor(Math.random() * 100),
          signalStrength: Math.floor(Math.random() * 100),
          location: 'Room 302, Floor 3',
          usageData: {
            hoursToday: parseFloat((Math.random() * 8).toFixed(1)),
            totalHours: Math.floor(Math.random() * 5000),
            powerCycles: Math.floor(Math.random() * 500),
          }
        };
        
        setDevice(mockDevice);
        
        // Generate mock usage data for the past 24 hours
        const mockUsageData: UsageDataPoint[] = [];
        const now = new Date();
        
        for (let i = 24; i >= 0; i--) {
          const timestamp = new Date(now);
          timestamp.setHours(now.getHours() - i);
          
          mockUsageData.push({
            timestamp: timestamp.toISOString(),
            powerUsage: 100 + Math.floor(Math.random() * 150),
            temperature: 35 + Math.floor(Math.random() * 15),
          });
        }
        
        setUsageData(mockUsageData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch IoT data');
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time updates (simulated)
    const intervalId = setInterval(() => {
      if (device) {
        // Update battery and signal randomly
        setDevice(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            batteryLevel: Math.max(0, Math.min(100, prev.batteryLevel + (Math.random() > 0.7 ? -1 : 1))),
            signalStrength: Math.max(0, Math.min(100, prev.signalStrength + (Math.random() > 0.7 ? -2 : 1))),
            lastActive: new Date().toISOString(),
          };
        });
        
        // Add new data point
        setUsageData(prev => {
          const newPoint: UsageDataPoint = {
            timestamp: new Date().toISOString(),
            powerUsage: 100 + Math.floor(Math.random() * 150),
            temperature: 35 + Math.floor(Math.random() * 15),
          };
          
          // Keep only the last 25 points
          const updatedData = [...prev, newPoint];
          if (updatedData.length > 25) {
            return updatedData.slice(updatedData.length - 25);
          }
          return updatedData;
        });
      }
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [equipmentId]);
  
  return { device, usageData, loading, error };
}
