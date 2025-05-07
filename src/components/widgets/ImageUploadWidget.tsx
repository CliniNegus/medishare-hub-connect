
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadWidgetProps {
  onImageSelected: (file: File) => void;
  label?: string;
  className?: string;
  accept?: string;
  previewUrl?: string;
}

const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  onImageSelected,
  label = "Upload Image",
  className = "",
  accept = "image/*",
  previewUrl,
}) => {
  const [preview, setPreview] = useState<string | undefined>(previewUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelected(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg p-3 ${className}`}>
      <div className="flex flex-col items-center">
        {preview ? (
          <div className="relative w-full mb-3">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-36 object-contain rounded-md" 
            />
            <Button 
              onClick={handleButtonClick}
              className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 h-8 w-8"
              title="Replace image"
              variant="outline"
              size="icon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-36 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md mb-3 cursor-pointer" onClick={handleButtonClick}>
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xs text-gray-400 mt-1">Click to browse files</p>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        {!preview && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleButtonClick}
            className="mt-2"
            size="sm"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            {label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUploadWidget;
