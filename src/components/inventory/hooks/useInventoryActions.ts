
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem } from '@/models/inventory';

export const useInventoryActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewDetails = (item: InventoryItem) => {
    navigate(`/equipment/${item.id}`);
  };

  const handleShare = async (item: InventoryItem) => {
    try {
      const shareData = {
        title: `${item.name} - Medical Equipment`,
        text: `Check out this medical equipment: ${item.name} by ${item.manufacturer}. Price: Ksh ${item.price.toLocaleString()}`,
        url: window.location.origin + `/equipment/${item.id}`
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: `${item.name} has been shared successfully.`,
        });
      } else {
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

  return {
    handleViewDetails,
    handleShare
  };
};
