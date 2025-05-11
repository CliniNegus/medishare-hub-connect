
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  id?: string;
  className?: string;
  label?: string;
  maxSizeMB?: number;
  aspectRatio?: number;
  height?: string;
  showLabel?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl,
  id = "image-upload",
  className = "",
  label = "Upload Image",
  maxSizeMB = 5,
  aspectRatio,
  height = "h-36",
  showLabel = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      toast({
        title: "File size error",
        description: `Maximum file size is ${maxSizeMB}MB`,
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

  const removeImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setPreview(undefined);
    onImageUploaded('');
  };

  const containerClasses = cn(
    "border-2 border-gray-300 border-dashed rounded-lg",
    aspectRatio ? "relative" : height,
    className
  );

  const aspectRatioStyles = aspectRatio
    ? { paddingTop: `${(1 / aspectRatio) * 100}%` }
    : {};

  return (
    <div className="space-y-2">
      {showLabel && <p className="text-sm text-gray-600 mb-1">{label}</p>}
      <div className={`flex items-center justify-center w-full`}>
        <label
          className={cn(
            containerClasses,
            "cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors",
            preview ? "p-0" : "p-4"
          )}
          style={aspectRatioStyles}
        >
          {preview ? (
            <div className={cn("relative w-full h-full", aspectRatio ? "absolute inset-0" : "")}>
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
                onClick={removeImage}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className={cn(
              "flex flex-col items-center justify-center",
              aspectRatio ? "absolute inset-0" : "h-full"
            )}>
              <Upload className="w-7 h-7 mb-3 text-[#E02020]" />
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. {maxSizeMB}MB)</p>
            </div>
          )}
          <input
            id={id}
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && (
        <div className="text-center text-sm text-[#333333]">
          Processing image...
        </div>
      )}
      {!preview && !aspectRatio && (
        <Button
          type="button"
          variant="secondary-outlined"
          onClick={handleButtonClick}
          className="mt-2 w-full"
          size="sm"
        >
          <Camera className="h-3.5 w-3.5 mr-1.5" />
          {label}
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
