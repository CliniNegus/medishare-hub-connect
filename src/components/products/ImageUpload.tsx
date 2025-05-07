
import React, { useState } from 'react';
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  id?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImageUrl, 
  id,
  className
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File size error",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      console.log("Processing image file:", file.name);

      // Create a base64 preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log("Base64 image created successfully");
        setPreview(base64String);
        onImageUploaded(base64String);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
      
    } catch (error: any) {
      console.error('Error handling file:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    console.log("Removing image");
    setPreview(undefined);
    onImageUploaded('');
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          {preview ? (
            <div className="relative w-full h-full">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-contain p-2"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  removeImage();
                }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-4 pb-4">
              <Upload className="w-7 h-7 mb-3 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
            </div>
          )}
          <input
            id={id || "product-image"}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && (
        <div className="text-center text-sm text-gray-500">
          Processing image...
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
