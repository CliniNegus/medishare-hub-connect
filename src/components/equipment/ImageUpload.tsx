
import React, { useState } from 'react';
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded,
  currentImageUrl
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
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      console.log("Starting file upload to Supabase Storage");
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log("Uploading file:", fileName);
      
      // Upload directly to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('equipment_images')
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Upload successful:", uploadData);
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('equipment_images')
        .getPublicUrl(fileName);

      console.log("Generated public URL:", publicUrl);
      
      setPreview(publicUrl);
      onImageUploaded(publicUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and is ready to use",
      });
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(undefined);
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
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
              {uploading && (
                <p className="text-xs text-blue-500 mt-2">Uploading...</p>
              )}
            </div>
          )}
          <input
            id="equipment-image"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};
