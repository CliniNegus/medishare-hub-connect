
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebsiteProductImportProps {
  onProductExtracted: (productData: any) => void;
}

export const WebsiteProductImport = ({ onProductExtracted }: WebsiteProductImportProps) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      setLoading(true);
      
      // Validate URL format
      if (!url.startsWith('http')) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }

      // Mock data for now - this will be replaced with real API call
      // in a future implementation
      setTimeout(() => {
        toast({
          title: "Coming Soon",
          description: "Website import functionality will be available in a future update. Please add product details manually for now.",
        });
        setLoading(false);
      }, 1500);

      // In the future, this would call an edge function to scrape the product data
      // const { data, error } = await supabase.functions.invoke('scrape-product', {
      //   body: { url }
      // });
      // 
      // if (error) throw error;
      // onProductExtracted(data);
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message || "Unable to import product details. Please try again or enter manually.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 border border-red-100 rounded-lg mb-6 bg-white">
      <h3 className="text-lg font-semibold text-[#333333]">Import from Manufacturer Website</h3>
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="Enter product URL from manufacturer website"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
        </div>
        <Button 
          onClick={handleImport} 
          disabled={!url || loading}
          className="bg-[#E02020] hover:bg-[#E02020]/90"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Link className="h-4 w-4 mr-2" />
              Import
            </>
          )}
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Paste a product URL to automatically import details from manufacturer websites.
        Supported manufacturers include Siemens, GE Healthcare, Philips, and more.
      </p>
    </div>
  );
};
