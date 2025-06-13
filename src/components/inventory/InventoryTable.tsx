
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Filter, Share2, Eye } from "lucide-react";
import { InventoryItem } from '@/models/inventory';
import { useToast } from '@/hooks/use-toast';

interface InventoryTableProps {
  items: InventoryItem[];
  onViewItem: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onViewItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredItems = items.filter(item => 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter === 'all' || item.category === filter)
  );

  const handleViewDetails = (item: InventoryItem) => {
    // Navigate to the equipment details page
    navigate(`/equipment/${item.id}`);
  };

  const handleShare = async (item: InventoryItem) => {
    try {
      // Create shareable content
      const shareData = {
        title: `${item.name} - Medical Equipment`,
        text: `Check out this medical equipment: ${item.name} by ${item.manufacturer}. Price: Ksh ${item.price.toLocaleString()}`,
        url: window.location.origin + `/equipment/${item.id}`
      };

      // Check if Web Share API is available
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: `${item.name} has been shared successfully.`,
        });
      } else {
        // Fallback: Copy to clipboard
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to Clipboard",
          description: `${item.name} details copied to clipboard for sharing.`,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share Failed",
        description: "Unable to share at this time. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (currentStock: number) => {
    if (currentStock === 0) return { color: 'text-red-500', status: 'Out of Stock' };
    if (currentStock < 5) return { color: 'text-orange-500', status: 'Low Stock' };
    return { color: 'text-green-500', status: 'In Stock' };
  };

  const categories = ['all', 'imaging', 'surgical', 'respiratory', 'monitoring', 'diagnostic'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by name, SKU, or manufacturer..." 
            className="pl-10 min-w-[300px]" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-[#E02020] focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <Button variant="outline" size="icon" className="border-[#E02020] text-[#E02020] hover:bg-red-50">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-[#333333]">Item Details</TableHead>
              <TableHead className="font-semibold text-[#333333]">SKU</TableHead>
              <TableHead className="font-semibold text-[#333333]">Category</TableHead>
              <TableHead className="text-center font-semibold text-[#333333]">Stock Status</TableHead>
              <TableHead className="text-center font-semibold text-[#333333]">Available</TableHead>
              <TableHead className="text-right font-semibold text-[#333333]">Price</TableHead>
              <TableHead className="text-right font-semibold text-[#333333]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No inventory items found</p>
                  <p className="text-sm">Try adjusting your search criteria or add new equipment</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const stockStatus = getStockStatus(item.currentStock);
                return (
                  <TableRow 
                    key={item.id} 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleViewDetails(item)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-equipment.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-[#333333]">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.manufacturer}</div>
                          <div className="text-xs text-gray-400">{item.location}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {item.sku}
                      </code>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="capitalize font-medium">
                        {item.category}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-semibold ${stockStatus.color}`}>
                          {item.currentStock}
                        </span>
                        <span className={`text-xs ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <span className="font-medium text-blue-600">
                        {item.availableForSharing}
                      </span>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-semibold text-[#333333]">
                          Ksh {item.price.toLocaleString()}
                        </span>
                        {item.leasingPrice > 0 && (
                          <span className="text-xs text-gray-500">
                            Lease: Ksh {item.leasingPrice}/mo
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleViewDetails(item);
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleShare(item);
                          }}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 px-2">
          <span>
            Showing {filteredItems.length} of {items.length} items
          </span>
          <span>
            Total value: Ksh {filteredItems.reduce((sum, item) => sum + (item.price * item.currentStock), 0).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
