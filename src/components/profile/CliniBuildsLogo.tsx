
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from '@/components/products/ImageUpload';
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CliniBuildsLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchSystemLogo();
  }, []);

  const fetchSystemLogo = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'company_logo')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data?.value) {
        setLogoUrl(data.value);
      }
    } catch (error: any) {
      console.error('Error fetching system logo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (url: string) => {
    setLogoUrl(url);
    
    try {
      setLoading(true);
      
      // Check if setting exists
      const { data: existingData } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'company_logo')
        .single();
      
      if (existingData) {
        // Update existing setting
        const { error } = await supabase
          .from('system_settings')
          .update({ value: url })
          .eq('key', 'company_logo');
        
        if (error) throw error;
      } else {
        // Insert new setting
        const { error } = await supabase
          .from('system_settings')
          .insert({ key: 'company_logo', value: url });
        
        if (error) throw error;
      }
      
      toast({
        title: "Logo updated",
        description: "The company logo has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving logo:', error);
      toast({
        title: "Error updating logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Logo</CardTitle>
        <CardDescription>
          Update the CliniBuilds logo used throughout the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border">
            {logoUrl ? (
              <AvatarImage src={logoUrl} alt="Company logo" />
            ) : (
              <AvatarFallback className="text-xl">CB</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium">CliniBuilds</h3>
            <p className="text-sm text-gray-500">Medical equipment sharing platform</p>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Logo
          </label>
          <ImageUpload
            onImageUploaded={handleLogoUpload}
            currentImageUrl={logoUrl}
            bucketName="logos"
            folderPath="company"
          />
          <p className="text-xs text-gray-500 mt-2">
            Recommended size: 512x512 pixels. PNG or JPEG format.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CliniBuildsLogo;
