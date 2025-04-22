
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QrCode, Camera, Link, Settings } from "lucide-react";
import { EquipmentProps } from '../EquipmentCard';
import { useToast } from "@/components/ui/use-toast";

interface EquipmentQrScannerProps {
  equipmentData: EquipmentProps[];
  onEquipmentScanned: (id: string) => void;
  selectedEquipmentId: string | null;
}

const EquipmentQrScanner: React.FC<EquipmentQrScannerProps> = ({
  equipmentData,
  onEquipmentScanned,
  selectedEquipmentId
}) => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const selectedEquipment = selectedEquipmentId 
    ? equipmentData.find(eq => eq.id === selectedEquipmentId) 
    : null;

  // Mock function for QR scanning - in a real app, this would use a library like jsQR
  const startScanner = () => {
    setScanning(true);
    
    // Mock scan effect - in a real app this would continuously scan
    setTimeout(() => {
      // Simulate scanning a random equipment from our list
      const randomEquipment = equipmentData[Math.floor(Math.random() * equipmentData.length)];
      setLastScanned(randomEquipment.id);
      setQrCodeValue(randomEquipment.id);
      onEquipmentScanned(randomEquipment.id);
      setScanning(false);
      
      toast({
        title: "Equipment Scanned",
        description: `Successfully scanned: ${randomEquipment.name}`,
      });
    }, 2000);
  };
  
  const stopScanner = () => {
    setScanning(false);
  };

  // Generate a QR code for the currently selected equipment
  const generateQrCode = (equipmentId: string) => {
    // In a real app, this would use a library like qrcode.react
    // For now, we'll just mock the QR code generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${equipmentId}`;
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-800">QR Code Scanner</h3>
          
          <div className="bg-gray-100 rounded-lg border border-gray-200 p-4 mb-4 aspect-square flex flex-col items-center justify-center">
            {scanning ? (
              <>
                <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover"
                    autoPlay 
                    playsInline
                    muted
                  />
                  <canvas 
                    ref={canvasRef} 
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="mt-4 animate-pulse text-center text-red-600">
                  Scanning QR Code...
                </div>
              </>
            ) : (
              <div className="text-center flex flex-col items-center">
                <Camera className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">QR Scanner ready</p>
                <p className="text-sm text-gray-400 mb-4">Position the QR code in the camera view</p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-4">
            {!scanning ? (
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={startScanner}
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Scanner
              </Button>
            ) : (
              <Button 
                className="flex-1"
                variant="outline"
                onClick={stopScanner}
              >
                Stop Scanner
              </Button>
            )}
          </div>
          
          {lastScanned && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <QrCode className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Equipment Scanned</AlertTitle>
              <AlertDescription className="text-green-700">
                {equipmentData.find(eq => eq.id === lastScanned)?.name || "Equipment"} has been successfully scanned.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-800">Equipment QR Code</h3>
          
          {selectedEquipment ? (
            <Card className="border-red-200">
              <CardContent className="p-6 flex flex-col items-center">
                <h4 className="font-medium text-lg mb-2">{selectedEquipment.name}</h4>
                <p className="text-sm text-gray-500 mb-4">ID: {selectedEquipment.id}</p>
                
                <div className="bg-white p-2 border border-gray-200 rounded-md mb-4">
                  <img 
                    src={generateQrCode(selectedEquipment.id)} 
                    alt={`QR Code for ${selectedEquipment.name}`}
                    className="w-48 h-48"
                  />
                </div>
                
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                    <Link className="h-4 w-4 mr-2" />
                    Share QR Code
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                    <Settings className="h-4 w-4 mr-2" />
                    Print Label
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center aspect-square">
              <QrCode className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">Select equipment to generate QR code</p>
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">QR Code Instructions</h4>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>Scan equipment QR codes for quick identification</li>
              <li>Generate and print QR codes for new equipment</li>
              <li>Attach printed QR codes to equipment for easy tracking</li>
              <li>Use this scanner to quickly find equipment information and history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentQrScanner;
