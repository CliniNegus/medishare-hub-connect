
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
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
      // For now, we'll just show a message that this feature is coming soon
      toast({
        title: "Coming Soon",
        description: "Website import functionality will be available in a future update. Please add product details manually for now.",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Unable to import product details. Please try again or enter manually.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-lg mb-6">
      <h3 className="text-lg font-semibold text-[#333333]">Import from Website</h3>
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="Enter product URL"
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
          <Link className="h-4 w-4 mr-2" />
          Import
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Paste a product URL to automatically import details from manufacturer websites
      </p>
    </div>
  );
};
