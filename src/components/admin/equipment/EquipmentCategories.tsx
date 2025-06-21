
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, AlertCircle } from "lucide-react";
import { useEquipmentCategories } from '@/hooks/useEquipmentCategories';

const EquipmentCategories = () => {
  const { categories, loading, error, refreshCategories } = useEquipmentCategories();

  if (loading) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#333333]">Equipment Categories</h3>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#E02020]" />
          <span className="ml-2 text-gray-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#333333]">Equipment Categories</h3>
        <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <span className="ml-2 text-red-600">Failed to load categories</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshCategories}
            className="ml-4 border-red-300 text-red-600 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#333333]">Equipment Categories</h3>
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <Package className="h-6 w-6 text-gray-400" />
          <span className="ml-2 text-gray-600">No equipment categories found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#333333]">Equipment Categories</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshCategories}
          className="border-gray-300 hover:bg-gray-50"
        >
          Refresh
        </Button>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {categories.map((categoryData, index) => (
          <AccordionItem key={categoryData.category} value={`item-${index}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <span className="text-left font-medium text-[#333333]">
                  {categoryData.category}
                </span>
                <Badge 
                  variant="secondary" 
                  className="bg-[#E02020]/10 text-[#E02020] hover:bg-[#E02020]/20"
                >
                  {categoryData.count} {categoryData.count === 1 ? 'item' : 'items'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoryData.items.slice(0, 6).map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
                    >
                      <div>
                        <p className="font-medium text-sm text-[#333333]">{item.name}</p>
                        {item.manufacturer && (
                          <p className="text-xs text-gray-600">{item.manufacturer}</p>
                        )}
                      </div>
                      <Badge 
                        variant={item.status === 'Available' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          item.status === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'Leased'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                {categoryData.items.length > 6 && (
                  <p className="text-sm text-gray-600 text-center">
                    +{categoryData.items.length - 6} more items
                  </p>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-[#E02020] text-[#E02020] hover:bg-[#E02020]/5"
                >
                  View All {categoryData.category} Equipment
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default EquipmentCategories;
