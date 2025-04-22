
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Scan, Camera, X } from "lucide-react";

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose }) => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startScanner = async () => {
    setIsScanning(true);
    setCameraError(null);
    
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // In a real implementation, we would use a library like jsQR to scan for QR codes
      // For this demo, we'll simulate scanning after a delay
      
      setTimeout(() => {
        simulateQRScan();
      }, 3000);
      
    } catch (error: any) {
      setCameraError(error.message || 'Unable to access camera');
      setIsScanning(false);
      
      toast({
        variant: "destructive",
        title: "Camera access error",
        description: "Please ensure camera permissions are granted for this site.",
      });
    }
  };
  
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };
  
  const simulateQRScan = () => {
    // In a real implementation, this would be where we analyze video frames for QR codes
    
    // For this demo, we'll simulate finding a code
    const simulatedQRData = `EQUIP-${Math.floor(Math.random() * 1000)}-MRI-SCANNER`;
    
    // Take a "snapshot" from the video
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    
    // Stop the scanner
    stopScanner();
    
    // Notify parent component
    onScan(simulatedQRData);
    
    toast({
      title: "QR Code Scanned",
      description: `Equipment ID: ${simulatedQRData}`,
    });
  };
  
  useEffect(() => {
    // Clean up on unmount
    return () => {
      stopScanner();
    };
  }, []);
  
  return (
    <Card className="w-full border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <QrCode className="h-5 w-5 mr-2" />
          QR Code Scanner
        </CardTitle>
        <CardDescription>
          Scan equipment QR codes to quickly access information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {isScanning ? (
            <div className="bg-black rounded-md overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
                onPlay={() => {
                  // Set canvas dimensions to match video
                  if (canvasRef.current && videoRef.current) {
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                  }
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scan overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-red-500 rounded-lg opacity-70 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-red-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-red-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-red-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-red-500"></div>
                </div>
              </div>
              
              {/* Loading indicator */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-black bg-opacity-50 text-white text-sm py-1 px-3 rounded-full">
                  Scanning...
                </div>
              </div>
              
              {/* Close button */}
              <button 
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                onClick={stopScanner}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
              {cameraError ? (
                <div className="text-center p-4">
                  <div className="text-red-600 mb-2">Camera Error</div>
                  <p className="text-sm text-gray-600 mb-4">{cameraError}</p>
                  <Button variant="outline" onClick={() => setCameraError(null)}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  <Camera className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">Ready to scan equipment QR codes</p>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
        
        {!isScanning && !cameraError && (
          <Button className="ml-auto" onClick={startScanner}>
            <Scan className="h-4 w-4 mr-2" />
            Start Scanning
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QRCodeScanner;
